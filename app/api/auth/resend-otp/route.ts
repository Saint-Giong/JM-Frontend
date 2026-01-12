import { buildEndpoint } from '@/lib/api/config';
import { type NextRequest, NextResponse } from 'next/server';
import { forwardCookies } from '../_utils/cookies';

export async function POST(request: NextRequest) {
  try {
    // Get cookies from the incoming request to forward to backend
    const accessToken = request.cookies.get('ACCESS_TOKEN')?.value;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Forward the access token as Authorization header (matching Gateway behavior)
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const backendResponse = await fetch(buildEndpoint('auth/resend-otp'), {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    });

    const data = await backendResponse.json();

    // Create response with the same status
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // Forward cookies from backend (if any)
    forwardCookies(backendResponse, response);

    return response;
  } catch (error) {
    console.error('[Auth Proxy] Resend OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
