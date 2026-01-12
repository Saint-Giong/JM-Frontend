import { type NextRequest, NextResponse } from 'next/server';
import { buildEndpoint } from '@/lib/api/config';
import { forwardCookies } from '../../_utils/cookies';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Authorization code is required' },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(
      buildEndpoint(`auth/google/auth?code=${encodeURIComponent(code)}`),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await backendResponse.json();

    // Create response with the same status
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // Forward cookies from backend (TEMP_TOKEN for new users, ACCESS_TOKEN for existing users)
    forwardCookies(backendResponse, response);

    return response;
  } catch (error) {
    console.error('[Auth Proxy] Google callback error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
