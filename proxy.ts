import { type NextRequest, NextResponse } from 'next/server';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

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
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods':
            'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Read the request body for non-GET requests
    let body: string | null = null;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.text();
    }

    console.log('[Proxy] Forwarding request:', {
      method: request.method,
      targetUrl,
      body: body ? JSON.parse(body) : null,
    });

    // Forward the request to the backend
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    // Get response body
    const responseBody = await response.text();

    console.log('[Proxy] Response:', {
      status: response.status,
      statusText: response.statusText,
      body: responseBody ? responseBody.substring(0, 500) : null,
    });

    // Handle 204 No Content - cannot have a body
    if (response.status === 204) {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods':
            'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Create response with CORS headers
    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type':
          response.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/proxy/:path*',
};
