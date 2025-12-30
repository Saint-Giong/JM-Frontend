import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: 'Logout successful' },
    { status: 200 }
  );

  // Clear ACCESS_TOKEN cookie
  response.cookies.set('ACCESS_TOKEN', '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  // Clear REFRESH_TOKEN cookie
  response.cookies.set('REFRESH_TOKEN', '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  // Clear TEMP_TOKEN cookie (in case of incomplete Google signup)
  response.cookies.set('TEMP_TOKEN', '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return response;
}
