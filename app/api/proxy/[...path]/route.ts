import { type NextRequest, NextResponse } from 'next/server';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:8072';

// In development, allow self-signed certificates for the backend
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Only forward these specific cookies to the backend
const AUTH_COOKIES = ['auth_token', 'refresh_token', 'temp_token'];

function filterAuthCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map((c) => c.trim());
  const authCookies = cookies.filter((cookie) => {
    const name = cookie.split('=')[0];
    return AUTH_COOKIES.includes(name);
  });

  return authCookies.length > 0 ? authCookies.join('; ') : null;
}

async function handleProxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Remove the /api/proxy prefix to get the actual API path
  const apiPath = pathname.replace('/api/proxy', '');
  const targetUrl = `${API_BASE_URL}${apiPath}${search}`;

  // Read the request body for non-GET requests
  let body: string | null = null;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      body = await request.text();
    } catch {
      body = null;
    }
  }

  // Get only auth cookies from the incoming request
  const allCookies = request.headers.get('cookie');
  const authCookies = filterAuthCookies(allCookies);

  console.log('[Proxy] Forwarding request:', {
    method: request.method,
    targetUrl,
    hasAuthCookies: !!authCookies,
  });

  // Forward the request to the backend with filtered cookies
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
      ...(authCookies ? { Cookie: authCookies } : {}),
    },
    body,
  });

  // Get response body
  const responseBody = await response.text();

  // Get Set-Cookie headers from backend response
  const setCookieHeaders = response.headers.getSetCookie();

  console.log('[Proxy] Response:', {
    status: response.status,
    setCookies: setCookieHeaders.length,
  });

  // Handle 204 No Content - cannot have a body
  if (response.status === 204) {
    const res = new NextResponse(null, { status: 204 });
    setCookieHeaders.forEach((cookie) => {
      res.headers.append('Set-Cookie', cookie);
    });
    return res;
  }

  // Create response with forwarded cookies
  const res = new NextResponse(responseBody, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      'Content-Type':
        response.headers.get('Content-Type') || 'application/json',
    },
  });

  // Forward Set-Cookie headers from backend to client
  setCookieHeaders.forEach((cookie) => {
    res.headers.append('Set-Cookie', cookie);
  });

  return res;
}

export async function GET(request: NextRequest) {
  return handleProxy(request);
}

export async function POST(request: NextRequest) {
  return handleProxy(request);
}

export async function PUT(request: NextRequest) {
  return handleProxy(request);
}

export async function PATCH(request: NextRequest) {
  return handleProxy(request);
}

export async function DELETE(request: NextRequest) {
  return handleProxy(request);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
