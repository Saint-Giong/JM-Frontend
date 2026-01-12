import { buildEndpoint } from '@/lib/api/config';
import { type NextRequest, NextResponse } from 'next/server';
import { forwardCookies } from '../_utils/cookies';

export async function POST(request: NextRequest) {
  try {
    // Get cookies from the incoming request to forward to backend
    const refreshToken = request.cookies.get('REFRESH_TOKEN')?.value;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Forward the refresh token as header (matching Gateway behavior)
    if (refreshToken) {
      headers['X-Refresh-Token'] = refreshToken;
    }

    const backendResponse = await fetch(buildEndpoint('auth/refresh-token'), {
      method: 'POST',
      headers,
    });

    const data = await backendResponse.json();

    // Create response with the same status
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // Forward cookies from backend
    forwardCookies(backendResponse, response);

    return response;
  } catch (error) {
    console.error('[Auth Proxy] Refresh token error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
