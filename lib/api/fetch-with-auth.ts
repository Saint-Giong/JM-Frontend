/**
 * Fetch wrapper with automatic token refresh on 401 errors
 * 
 * Flow:
 * 1. FE calls API (e.g., Profile) → gets 401
 * 2. FE calls /refresh-token to get new tokens
 * 3. After refresh, FE retries the original request
 */

import { buildEndpoint } from './config';

// Track if a refresh is in progress to avoid multiple simultaneous refreshes
let isRefreshing = false;
let refreshPromise: Promise<RefreshResult> | null = null;

// Result of token refresh
interface RefreshResult {
  success: boolean;
  companyId?: string;
}

// Queue of requests waiting for token refresh
type QueueItem = {
  resolve: (value: RefreshResult) => void;
  reject: (error: Error) => void;
};
let failedQueue: QueueItem[] = [];

const processQueue = (result: RefreshResult, error?: Error) => {
  failedQueue.forEach((item) => {
    if (result.success) {
      item.resolve(result);
    } else {
      item.reject(error || new Error('Token refresh failed'));
    }
  });
  failedQueue = [];
};

/**
 * Refresh the access token using the refresh token cookie
 * Returns companyId and email from the refresh response
 */
async function refreshAccessToken(): Promise<RefreshResult> {
  try {
    const response = await fetch(buildEndpoint('auth/refresh-token'), {
      method: 'POST',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[Auth] Token refresh failed:', response.status);
      return { success: false };
    }    const data = await response.json();
    if (data.success === true) {
      return {
        success: true,
        companyId: data.companyId,
      };
    }
    return { success: false };
  } catch (error) {
    console.error('[Auth] Token refresh error:', error);
    return { success: false };
  }
}

/**
 * Handle 401 error by refreshing token and retrying the request
 */
async function handleUnauthorized(): Promise<RefreshResult> {
  if (isRefreshing) {
    // If already refreshing, wait for it to complete
    return new Promise<RefreshResult>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  refreshPromise = refreshAccessToken();

  try {
    const result = await refreshPromise;
    processQueue(result);
    return result;
  } catch (error) {
    const failedResult: RefreshResult = { success: false };
    processQueue(failedResult, error instanceof Error ? error : new Error('Unknown error'));
    return failedResult;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

/**
 * Fetch with automatic token refresh on 401 errors
 * 
 * Usage:
 * ```ts
 * const response = await fetchWithAuth('/api/proxy/v1/profile/me', {
 *   method: 'GET',
 *   credentials: 'include',
 * });
 * ```
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Ensure credentials are included for cookies
  const fetchOptions: RequestInit = {
    ...options,
    credentials: 'include',
  };

  // First attempt
  let response = await fetch(url, fetchOptions);

  // If 401, try to refresh token and retry
  if (response.status === 401) {
    console.log('[Auth] Got 401, attempting token refresh...');
    
    const refreshResult = await handleUnauthorized();
    
    if (refreshResult.success) {
      console.log('[Auth] Token refreshed, retrying original request...');
        // Update auth store with companyId from refresh response
      if (refreshResult.companyId) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:token-refreshed', {
            detail: {
              companyId: refreshResult.companyId,
            }
          }));
        }
      }
      
      // Retry the original request
      response = await fetch(url, fetchOptions);
    } else {
      console.log('[Auth] Token refresh failed, user needs to re-login');
      // Dispatch an event that can be caught to redirect to login
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
      }
    }
  }

  return response;
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
  callback: (data: { companyId?: string }) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<{ companyId?: string }>;
    callback(customEvent.detail);
  };
  
  window.addEventListener('auth:token-refreshed', handler);
  
  return () => {
    window.removeEventListener('auth:token-refreshed', handler);
  };
}
