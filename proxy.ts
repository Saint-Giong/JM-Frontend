import { type NextRequest, NextResponse } from 'next/server';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:8072';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only proxy requests to /api/proxy/*
  if (pathname.startsWith('/api/proxy/')) {
    // Remove the /api/proxy prefix to get the actual API path
    const apiPath = pathname.replace('/api/proxy', '');
    const targetUrl = `${API_BASE_URL}${apiPath}`;

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
          'Access-Control-Allow-Methods':
            'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
          'Access-Control-Allow-Credentials': 'true',
        },
      });
    }

    // Read the request body for non-GET requests
    let body: string | null = null;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.text();
    }

    // Get cookies from the incoming request to forward to backend
    const cookies = request.headers.get('cookie');

    console.log('[Proxy] Forwarding request:', {
      method: request.method,
      targetUrl,
      hasCookies: !!cookies,
      body: body ? JSON.parse(body) : null,
    });

    // Forward the request to the backend with cookies
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        ...(cookies ? { Cookie: cookies } : {}),
      },
      body,
    });

    // Get response body
    const responseBody = await response.text();

    // Get Set-Cookie headers from backend response
    const setCookieHeaders = response.headers.getSetCookie();

    console.log('[Proxy] Response:', {
      status: response.status,
      statusText: response.statusText,
      setCookies: setCookieHeaders.length,
      body: responseBody ? responseBody.substring(0, 500) : null,
    });

    // Handle 204 No Content - cannot have a body
    if (response.status === 204) {
      const res = new NextResponse(null, {
        status: 204,
      });
      // Forward any Set-Cookie headers
      setCookieHeaders.forEach((cookie) => {
        res.headers.append('Set-Cookie', cookie);
      });
      return res;
    }

    // Create response with CORS headers and forwarded cookies
    const res = new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type':
          response.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
        'Access-Control-Allow-Credentials': 'true',
      },
    });

    // Forward Set-Cookie headers from backend to client
    setCookieHeaders.forEach((cookie) => {
      res.headers.append('Set-Cookie', cookie);
    });

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/proxy/:path*',
};
