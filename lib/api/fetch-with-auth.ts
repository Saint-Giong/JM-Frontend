/**
 * Fetch wrapper that routes through the proxy for authenticated requests
 *
 * Flow:
 * 1. Client calls fetchWithAuth with backend path (e.g., 'profile/me')
 * 2. Request goes through /api/proxy/v1/profile/me
 * 3. Proxy reads HttpOnly cookies and adds Authorization header
 * 4. Proxy handles 401 by refreshing token and retrying
 * 5. Response returned to client with any new cookies set
 */

import { getApiUrl } from './config';

/**
 * Extract path from a URL or return path as-is
 * Handles both:
 * - Full URLs: https://localhost:8072/v1/profile/me -> profile/me
 * - Paths: profile/me -> profile/me
 * - Paths with v1: v1/profile/me -> v1/profile/me
 */
function extractPath(urlOrPath: string): string {
  // If it's a full URL, extract the path
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
    try {
      const url = new URL(urlOrPath);
      // Remove leading slash
      return url.pathname.slice(1);
    } catch {
      // Invalid URL, treat as path
      return urlOrPath;
    }
  }

  // It's already a path
  return urlOrPath;
}

/**
 * Build proxy URL for a given path or URL
 * @param urlOrPath - The API path (e.g., 'profile/me') or full URL
 */
export function buildProxyUrl(urlOrPath: string): string {
  // Extract path from URL if needed
  let cleanPath = extractPath(urlOrPath);

  // Remove leading slash
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.slice(1);
  }

  // Add v1 prefix if not present
  if (!cleanPath.startsWith('v1/')) {
    cleanPath = `v1/${cleanPath}`;
  }

  // In browser, use relative path; on server, use absolute
  if (typeof window === 'undefined') {
    // Server-side - use absolute URL
    const host = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${host}/api/proxy/${cleanPath}`;
  }

  return `/api/proxy/${cleanPath}`;
}

/**
 * Check if the URL should be proxied
 * Only proxy requests to the backend API
 */
function shouldProxy(urlOrPath: string): boolean {
  // If it starts with /api/proxy, it's already proxied
  if (urlOrPath.startsWith('/api/proxy')) {
    return false;
  }

  // If it's a full URL
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
    // Check if it's the backend URL
    const apiUrl = getApiUrl();
    return urlOrPath.startsWith(apiUrl);
  }

  // It's a path, proxy it
  return true;
}

/**
 * Fetch with automatic routing through proxy
 *
 * Usage:
 * ```ts
 * // Using path only (recommended)
 * const response = await fetchWithAuth('profile/me');
 *
 * // With full URL (backward compatible)
 * const response = await fetchWithAuth(buildEndpoint('profile/me'));
 *
 * // With options
 * const response = await fetchWithAuth('companies/123', {
 *   method: 'PUT',
 *   body: JSON.stringify(data),
 * });
 * ```
 */
export async function fetchWithAuth(
  urlOrPath: string,
  options: RequestInit = {}
): Promise<Response> {
  // Build the URL - either proxy or direct
  const url = shouldProxy(urlOrPath) ? buildProxyUrl(urlOrPath) : urlOrPath;

  // Check if body is FormData - if so, don't set Content-Type
  // The browser will set it automatically with the correct boundary
  const isFormData = options.body instanceof FormData;

  // Build headers - only set Content-Type for non-FormData requests
  const headers: HeadersInit = isFormData
    ? { ...options.headers }
    : {
        'Content-Type': 'application/json',
        ...options.headers,
      };

  // Ensure credentials are included for cookies
  const fetchOptions: RequestInit = {
    ...options,
    credentials: 'include',
    headers,
  };

  try {
    const response = await fetch(url, fetchOptions);

    // If 401, the proxy already tried to refresh
    // This means the session is truly expired
    if (response.status === 401) {
      console.log('[Auth] Session expired (proxy refresh failed)');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
      }
    }

    return response;
  } catch (error) {
    console.error('[Auth] Network error during request:', error);
    throw error;
  }
}

/**
 * Helper to check if user should be redirected to login
 * Can be used in components to listen for session expiry
 */
export function onSessionExpired(callback: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = () => callback();
  window.addEventListener('auth:session-expired', handler);

  return () => {
    window.removeEventListener('auth:session-expired', handler);
  };
}

/**
 * Listen for token refresh events to update auth state
 * Returns the cleanup function
 */
export function onTokenRefreshed(
  callback: (data: {
    companyId?: string;
    accessToken?: string;
    refreshToken?: string;
  }) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<{
      companyId?: string;
      accessToken?: string;
      refreshToken?: string;
    }>;
    callback(customEvent.detail);
  };

  window.addEventListener('auth:token-refreshed', handler);

  return () => {
    window.removeEventListener('auth:token-refreshed', handler);
  };
}
