'use client';

import { useEffect, useRef } from 'react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

/**
 * Component to initialize auth state and proactively refresh tokens.
 * 
 * This handles the case where:
 * - User has REFRESH_TOKEN cookie but no ACCESS_TOKEN
 * - localStorage shows isAuthenticated=true (persisted from previous session)
 * 
 * On mount, it calls /api/auth/refresh-token to get a new ACCESS_TOKEN
 * so that subsequent API calls work properly.
 */
export function AuthInitializer() {
  const { isAuthenticated, hasHydrated, logout } = useAuthStore();
  const hasAttemptedRefresh = useRef(false);

  useEffect(() => {
    // Only run once after hydration, if user appears authenticated
    if (!hasHydrated || !isAuthenticated || hasAttemptedRefresh.current) {
      return;
    }

    hasAttemptedRefresh.current = true;

    const refreshTokens = async () => {
      console.log('[AuthInitializer] Proactively refreshing access token...');
      
      try {
        const result = await authApi.refreshToken();
        
        if (result.success) {
          console.log('[AuthInitializer] Token refresh successful');
        } else {
          console.log('[AuthInitializer] Token refresh failed, logging out...');
          await logout();
        }
      } catch (error) {
        console.error('[AuthInitializer] Token refresh error:', error);
        // If refresh fails (e.g., refresh token expired), log the user out
        await logout();
      }
    };

    refreshTokens();
  }, [hasHydrated, isAuthenticated, logout]);

  return null; // This component doesn't render anything
}
