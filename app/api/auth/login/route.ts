import { type NextRequest, NextResponse } from 'next/server';
import { buildEndpoint } from '@/lib/api/config';
import { forwardCookies } from '../_utils/cookies';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendResponse = await fetch(buildEndpoint('auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    // Create response with the same status
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // Forward cookies from backend, re-setting them for the frontend domain
    forwardCookies(backendResponse, response);

    return response;
  } catch (error) {
    console.error('[Auth Proxy] Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
