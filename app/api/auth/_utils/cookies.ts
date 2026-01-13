import type { NextResponse } from 'next/server';

// Cookie configuration for the frontend domain
// Uses SameSite=None to match backend cookie settings (required for cross-origin OAuth flows)
// Secure=true is required when SameSite=None
export const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
};

// Token TTLs (should match backend configuration)
export const TOKEN_TTLS = {
  ACCESS_TOKEN: 900, // 15 minutes
  REFRESH_TOKEN: 604800, // 7 days
  TEMP_TOKEN: 300, // 5 minutes
} as const;

/**
 * Parse Set-Cookie header to extract cookie name and value
 */
export function parseCookie(
  setCookieHeader: string
): { name: string; value: string } | null {
  const match = setCookieHeader.match(/^([^=]+)=([^;]*)/);
  if (!match) return null;
  return { name: match[1], value: match[2] };
}

/**
 * Forward cookies from backend response to the NextResponse
 * Re-sets cookies for the frontend domain instead of forwarding directly
 */
export function forwardCookies(
  backendResponse: Response,
  nextResponse: NextResponse
): void {
  const setCookieHeaders = backendResponse.headers.getSetCookie();

  for (const header of setCookieHeaders) {
    const parsed = parseCookie(header);
    if (!parsed) continue;

    const { name, value } = parsed;

    // Get appropriate maxAge based on token type
    const maxAge =
      TOKEN_TTLS[name as keyof typeof TOKEN_TTLS] || TOKEN_TTLS.ACCESS_TOKEN;

    nextResponse.cookies.set(name, value, {
      ...COOKIE_OPTIONS,
      maxAge,
    });
  }
}
