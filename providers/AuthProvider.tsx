'use client';

import { onSessionExpired, onTokenRefreshed } from '@/lib/api';
import { useAuthStore } from '@/stores';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * AuthProvider component that sets up global auth event listeners.
 * 
 * Listens for:
 * - auth:session-expired - redirects to login when refresh token fails
 * - auth:token-refreshed - updates auth store with companyId from refresh response
 * 
 * Wrap your app layout with this component.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Listen for session expired events (refresh token failed)
    const cleanupSessionExpired = onSessionExpired(() => {
      console.log('[AuthProvider] Session expired, redirecting to login...');
      
      // Clear auth state
      useAuthStore.setState({
        isAuthenticated: false,
        isActivated: false,
        companyId: null,
        userEmail: null,
        companyProfile: null,
      });
      
      // Redirect to login
      router.push('/login');
    });

    // Listen for token refresh events to update auth state
    const cleanupTokenRefreshed = onTokenRefreshed((data) => {
      console.log('[AuthProvider] Token refreshed, updating auth state:', data);
      
      const updates: Partial<{ companyId: string; isAuthenticated: boolean }> = {
        isAuthenticated: true,
      };
      
      if (data.companyId) {
        updates.companyId = data.companyId;
      }
      
      useAuthStore.setState(updates);
    });

    return () => {
      cleanupSessionExpired();
      cleanupTokenRefreshed();
    };
  }, [router]);

  return <>{children}</>;
}
