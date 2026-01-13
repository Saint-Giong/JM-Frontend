import { type NextRequest, NextResponse } from 'next/server';
import { buildEndpoint } from '@/lib/api/config';
import { forwardCookies } from '../_utils/cookies';

export async function POST(request: NextRequest) {
  const endpoint = buildEndpoint('auth/login');
  console.log('[Auth Proxy] Login request to:', endpoint);

  try {
    const body = await request.json();

    const backendResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Check if response is JSON
    const contentType = backendResponse.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await backendResponse.text();
      console.error('[Auth Proxy] Non-JSON response:', {
        status: backendResponse.status,
        contentType,
        body: text.substring(0, 200),
      });
      return NextResponse.json(
        {
          success: false,
          message: 'Backend returned non-JSON response',
          backendUrl: endpoint,
        },
        { status: 502 }
      );
    }

    const data = await backendResponse.json();

    // Create response with the same status
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // Forward cookies from backend, re-setting them for the frontend domain
    const setCookieHeaders = backendResponse.headers.getSetCookie();
    console.log('[Auth Proxy] Backend Set-Cookie headers:', setCookieHeaders);

    forwardCookies(backendResponse, response);

    // Log what cookies were set on the response
    const responseCookies = response.cookies.getAll();
    console.log(
      '[Auth Proxy] Cookies set on response:',
      responseCookies.map((c) => c.name)
    );

    return response;
  } catch (error) {
    console.error('[Auth Proxy] Login error:', {
      endpoint,
      error: error instanceof Error ? error.message : error,
    });
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to connect to backend',
        error: error instanceof Error ? error.message : 'Unknown error',
        backendUrl: endpoint,
      },
      { status: 502 }
    );
  }
}
