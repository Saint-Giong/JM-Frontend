import { buildEndpoint } from '@/lib/api/config';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get cookies from the incoming request to forward to backend
    const accessToken = request.cookies.get('ACCESS_TOKEN')?.value;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Forward the access token as Authorization header (matching Gateway behavior)
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const backendResponse = await fetch(buildEndpoint('auth/verify-account'), {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    // Create response with the same status
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // Forward Set-Cookie headers from backend to browser
    const setCookieHeaders = backendResponse.headers.getSetCookie();
    for (const cookie of setCookieHeaders) {
      response.headers.append('Set-Cookie', cookie);
    }

    return response;
  } catch (error) {
    console.error('[Auth Proxy] Verify account error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
