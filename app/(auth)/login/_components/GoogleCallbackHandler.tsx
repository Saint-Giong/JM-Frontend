'use client';

import { useAuthStore } from '@/stores/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface GoogleCallbackHandlerProps {
  onLoading?: (loading: boolean) => void;
  onError?: (error: string) => void;
}

/**
 * Component that detects Google OAuth callback parameters in URL
 * and processes the authentication flow.
 *
 * If the user is new, redirects to /signup/google with prefill data.
 * If the user exists, redirects to /dashboard after successful login.
 */
export function GoogleCallbackHandler({
  onLoading,
  onError,
}: GoogleCallbackHandlerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleGoogleCallback } = useAuthStore();
  const processedRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    // Only process if we have OAuth callback params and haven't processed yet
    if (!code || state !== 'login' || processedRef.current) return;
    processedRef.current = true;

    const processCallback = async () => {
      setIsProcessing(true);
      onLoading?.(true);

      const result = await handleGoogleCallback(code);

      if (!result.success) {
        onError?.(result.error || 'Authentication failed');
        onLoading?.(false);
        setIsProcessing(false);
        // Clear URL params to avoid re-processing
        router.replace('/login');
        return;
      }

      if (result.needsRegistration && result.prefill) {
        // Redirect to Google signup form with prefill data
        const params = new URLSearchParams({
          email: result.prefill.email,
          name: result.prefill.name,
        });
        router.push(`/signup/google?${params.toString()}`);
      } else {
        // Existing user logged in successfully
        router.push('/dashboard');
      }
    };

    processCallback();
  }, [searchParams, handleGoogleCallback, router, onLoading, onError]);

  // Show loading indicator while processing OAuth callback
  if (isProcessing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-muted-foreground text-sm">
            Signing in with Google...
          </p>
        </div>
      </div>
    );
  }

  return null;
}
