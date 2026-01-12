import { buildEndpoint } from '@/lib/api/config';
import { type NextRequest, NextResponse } from 'next/server';
import { forwardCookies } from '../../_utils/cookies';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get TEMP_TOKEN cookie from the incoming request
    const tempToken = request.cookies.get('TEMP_TOKEN')?.value;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Forward the temp token as Cookie header (Gateway expects cookies)
    if (tempToken) {
      headers.Cookie = `TEMP_TOKEN=${tempToken}`;
    }

    const backendResponse = await fetch(buildEndpoint('auth/google/register'), {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    // Create response with the same status
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // Forward cookies from backend (ACCESS_TOKEN, REFRESH_TOKEN after successful registration)
    forwardCookies(backendResponse, response);

    // Clear TEMP_TOKEN cookie after successful registration
    if (backendResponse.ok) {
      response.cookies.set('TEMP_TOKEN', '', {
        path: '/',
        maxAge: 0,
      });
    }

    return response;
  } catch (error) {
    console.error('[Auth Proxy] Google register error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
