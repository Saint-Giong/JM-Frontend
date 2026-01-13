import { type NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from '@/lib/api/config';
import { forwardCookies } from '../../auth/_utils/cookies';

/**
 * Generic API Proxy Route
 *
 * This proxy handles all authenticated API requests to the backend.
 * It runs on the server-side (Next.js API route) where it CAN read HttpOnly cookies.
 *
 * Flow:
 * 1. Client calls /api/proxy/v1/some/endpoint
 * 2. Proxy reads ACCESS_TOKEN from HttpOnly cookie
 * 3. Proxy adds Authorization: Bearer <token> header
 * 4. Proxy forwards request to backend: https://backend/v1/some/endpoint
 * 5. If 401, proxy attempts token refresh and retries
 * 6. Proxy forwards response (and any new cookies) back to client
 */

// Supported HTTP methods: GET, POST, PUT, PATCH, DELETE

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

/**
 * Attempt to refresh the access token
 */
async function refreshToken(
  refreshTokenValue: string
): Promise<{ success: boolean; response?: Response }> {
  const apiUrl = getApiUrl();

  const refreshResponse = await fetch(`${apiUrl}/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `REFRESH_TOKEN=${refreshTokenValue}`,
      'X-Refresh-Token': refreshTokenValue,
    },
  });

  if (refreshResponse.ok) {
    return { success: true, response: refreshResponse };
  }

  return { success: false };
}

/**
 * Forward the request to the backend
 */
async function forwardRequest(
  request: NextRequest,
  path: string[],
  accessToken?: string
): Promise<Response> {
  const apiUrl = getApiUrl();

  // Remove 'v1' prefix if present since getApiUrl() already includes it
  let cleanPath = [...path];
  if (cleanPath[0] === 'v1') {
    cleanPath = cleanPath.slice(1);
  }
  const targetPath = cleanPath.join('/');

  // Build the target URL with query params
  // Preserve trailing slash from original request URL if present
  const url = new URL(request.url);
  const originalPath = url.pathname;
  const hasTrailingSlash = originalPath.endsWith('/');

  let finalPath = targetPath;
  // Add trailing slash if original request had one and path doesn't already have one
  if (hasTrailingSlash && !finalPath.endsWith('/')) {
    finalPath = `${finalPath}/`;
  }

  // Spring Boot requires trailing slash for collection endpoints (GET on simple paths)
  // Add trailing slash for paths like 'subscription', 'payment', 'company', etc.
  // but NOT for paths with IDs like 'subscription/123' or nested paths like 'subscription/status/123'
  const pathSegments = finalPath.split('/').filter(Boolean);
  const isCollectionEndpoint =
    request.method === 'GET' &&
    pathSegments.length === 1 &&
    !finalPath.endsWith('/');

  if (isCollectionEndpoint) {
    finalPath = `${finalPath}/`;
  }

  const targetUrl = new URL(`${apiUrl}/${finalPath}`);
  targetUrl.search = url.search;

  // Build headers
  const headers: HeadersInit = {
    'Content-Type': request.headers.get('Content-Type') || 'application/json',
  };

  // Add Authorization header if we have a token
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  // Forward other relevant headers
  const forwardHeaders = ['Accept', 'Accept-Language', 'X-Request-ID'];
  for (const name of forwardHeaders) {
    const value = request.headers.get(name);
    if (value) {
      headers[name] = value;
    }
  }

  // Get request body for non-GET requests
  let body: string | undefined;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      body = await request.text();
    } catch {
      // No body
    }
  }

  // Debug: log outgoing request
  console.log('[Proxy] Forwarding request:', {
    url: targetUrl.toString(),
    method: request.method,
    hasAuthHeader: !!headers.Authorization,
    authHeaderPreview: headers.Authorization
      ? `${headers.Authorization.slice(0, 30)}...`
      : 'none',
  });

  // Forward the request
  const response = await fetch(targetUrl.toString(), {
    method: request.method,
    headers,
    body,
  });

  // Debug: log response
  console.log('[Proxy] Backend response:', {
    status: response.status,
    statusText: response.statusText,
    contentType: response.headers.get('content-type'),
  });

  return response;
}

/**
 * Handle the proxy request
 */
async function handleProxy(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { path } = await context.params;
    const apiUrl = getApiUrl();

    // Debug: Check if original URL had trailing slash
    const requestUrl = new URL(request.url);
    console.log('[Proxy] Original request URL:', requestUrl.pathname);

    // Remove 'v1' prefix for logging since getApiUrl() already includes it
    let cleanPath = [...path];
    if (cleanPath[0] === 'v1') {
      cleanPath = cleanPath.slice(1);
    }
    const targetPath = cleanPath.join('/');

    console.log(
      `[Proxy] ${request.method} /api/proxy/${path.join('/')} -> ${apiUrl}/${targetPath}`
    );

    // Get tokens from cookies
    const accessToken = request.cookies.get('ACCESS_TOKEN')?.value;
    const refreshTokenValue = request.cookies.get('REFRESH_TOKEN')?.value;

    // Debug: log cookie presence
    console.log('[Proxy] Cookies:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshTokenValue,
      accessTokenPreview: accessToken
        ? `${accessToken.slice(0, 20)}...`
        : 'none',
      allCookies: request.cookies.getAll().map((c) => c.name),
    });

    // First attempt
    let backendResponse = await forwardRequest(request, path, accessToken);

    // If 401 and we have a refresh token, try to refresh and retry
    if (backendResponse.status === 401 && refreshTokenValue) {
      console.log('[Proxy] Got 401, attempting token refresh...');

      const refreshResult = await refreshToken(refreshTokenValue);

      if (refreshResult.success && refreshResult.response) {
        console.log('[Proxy] Token refreshed, retrying request...');

        // Extract new access token from refresh response cookies
        const setCookieHeaders = refreshResult.response.headers.getSetCookie();
        let newAccessToken: string | undefined;

        for (const header of setCookieHeaders) {
          const match = header.match(/^ACCESS_TOKEN=([^;]*)/);
          if (match) {
            newAccessToken = match[1];
            break;
          }
        }

        // Retry the original request with new token
        backendResponse = await forwardRequest(
          request,
          path,
          newAccessToken || accessToken
        );

        // Create response and forward cookies from BOTH refresh and retry
        const responseData = await backendResponse.text();
        const response = new NextResponse(responseData, {
          status: backendResponse.status,
          headers: {
            'Content-Type':
              backendResponse.headers.get('Content-Type') || 'application/json',
          },
        });

        // Forward cookies from refresh response (new tokens)
        forwardCookies(refreshResult.response, response);
        // Forward any additional cookies from the retry response
        forwardCookies(backendResponse, response);

        return response;
      } else {
        console.log('[Proxy] Token refresh failed');
        // Return 401 to trigger client-side logout
      }
    }

    // Create response
    const responseData = await backendResponse.text();
    const response = new NextResponse(responseData, {
      status: backendResponse.status,
      headers: {
        'Content-Type':
          backendResponse.headers.get('Content-Type') || 'application/json',
      },
    });

    // Forward cookies from backend
    forwardCookies(backendResponse, response);

    return response;
  } catch (error) {
    const apiUrl = getApiUrl();
    console.error('[Proxy] Error connecting to backend:', {
      apiUrl,
      error: error instanceof Error ? error.message : error,
    });
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to connect to backend',
        error: error instanceof Error ? error.message : 'Unknown error',
        backendUrl: apiUrl,
      },
      { status: 502 }
    );
  }
}

// Export handlers for all methods
export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return handleProxy(request, context);
}

export async function POST(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return handleProxy(request, context);
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return handleProxy(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return handleProxy(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return handleProxy(request, context);
}
