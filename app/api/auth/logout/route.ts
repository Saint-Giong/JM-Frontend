import { NextResponse } from 'next/server';
import { buildEndpoint } from '@/lib/api/config';

export async function POST() {
  // First, call the backend logout endpoint to invalidate tokens on the server
  try {
    await fetch(buildEndpoint('auth/logout'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Log but don't fail - we still want to clear frontend cookies
    console.error('[Logout] Failed to call backend logout:', error);
  }

  const response = NextResponse.json(
    { success: true, message: 'Logout successful' },
    { status: 200 }
  );

  // Cookie settings must match backend: SameSite=None, Secure, HttpOnly
  // This ensures cross-origin cookies are properly cleared
  const cookieOptions = {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    secure: true, // Required for SameSite=None
    sameSite: 'none' as const,
  };

  // Clear ACCESS_TOKEN cookie
  response.cookies.set('ACCESS_TOKEN', '', cookieOptions);

  // Clear REFRESH_TOKEN cookie
  response.cookies.set('REFRESH_TOKEN', '', cookieOptions);

  // Clear TEMP_TOKEN cookie (in case of incomplete Google signup)
  response.cookies.set('TEMP_TOKEN', '', cookieOptions);

  return response;
}
