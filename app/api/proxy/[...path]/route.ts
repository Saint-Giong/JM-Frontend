import { type NextRequest, NextResponse } from 'next/server';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:8072';

// Build allowed base URLs list
const ALLOWED_BASE_URLS: string[] = [];

// Always allow the configured API base URL
if (process.env.NEXT_PUBLIC_API_BASE_URL) {
  ALLOWED_BASE_URLS.push(process.env.NEXT_PUBLIC_API_BASE_URL);
}

// In development, also allow localhost:8072
if (process.env.NODE_ENV === 'development') {
  ALLOWED_BASE_URLS.push('https://localhost:8072');
}

// Helper function to check if a target URL is allowed
function isUrlAllowed(targetUrl: string): boolean {
  try {
    const parsedUrl = new URL(targetUrl);
    const targetOrigin = parsedUrl.origin;
    return ALLOWED_BASE_URLS.some((allowedUrl) => {
      try {
        const allowedOrigin = new URL(allowedUrl).origin;
        return targetOrigin === allowedOrigin;
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}

// Only forward these specific cookies to the backend
const AUTH_COOKIES = ['ACCESS_TOKEN', 'REFRESH_TOKEN', 'TEMP_TOKEN'];

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

  // Validate that the target URL is allowed (prevent SSRF)
  if (!isUrlAllowed(targetUrl)) {
    console.error('[Proxy] Blocked request to unauthorized domain:', targetUrl);
    return NextResponse.json(
      { success: false, message: 'Forbidden: Target domain not allowed' },
      { status: 403 }
    );
  }

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
  let response: Response;
  try {
    response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        ...(authCookies ? { Cookie: authCookies } : {}),
      },
      body,
    });
  } catch (error) {
    console.error('[Proxy] Backend connection failed:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          'Unable to connect to backend server. Please ensure the backend is running.',
        error: error instanceof Error ? error.message : 'Network error',
      },
      { status: 503 }
    );
  }

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
