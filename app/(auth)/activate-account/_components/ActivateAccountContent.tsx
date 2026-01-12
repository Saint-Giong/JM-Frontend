'use client';

import { FormHeader } from '@/components/common/Form';
import { authApi } from '@/lib/api';
import { HttpError } from '@/lib/http';
import { Button } from '@saint-giong/bamboo-ui';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type ActivationStatus = 'loading' | 'success' | 'error';

export function ActivateAccountContent() {
  const searchParams = useSearchParams();
  const activationToken = searchParams.get('activationToken');

  const [status, setStatus] = useState<ActivationStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function activateAccount() {
      if (!activationToken) {
        setStatus('error');
        setErrorMessage(
          'Missing activation token. Please use the link from your email.'
        );
        return;
      }

      try {
        await authApi.activateAccountByEmail(activationToken);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        if (err instanceof HttpError) {
          const data = err.data as { message?: string } | undefined;
          setErrorMessage(data?.message || 'Failed to activate account');
        } else {
          setErrorMessage('An unexpected error occurred');
        }
      }
    }

    activateAccount();
  }, [activationToken]);

  const statusComponents = {
    loading: <LoadingState />,
    success: <SuccessState />,
    error: <ErrorState message={errorMessage} />,
  } as const;

  return statusComponents[status];
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-10">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted-foreground/30 border-t-foreground" />
      </div>
      <FormHeader
        title="Activating Your Account"
        subtitle="Please wait while we verify your activation link..."
      />
    </div>
  );
}

function SuccessState() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-10">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg
          className="h-8 w-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>Success</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <FormHeader
        title="Account Activated!"
        subtitle="Your account has been successfully activated. You can now log in."
      />
      <Link href="/login">
        <Button className="h-[2.625rem] w-[17.5rem] rounded-sm bg-foreground text-background hover:bg-foreground/90">
          Go to Login
        </Button>
      </Link>
    </div>
  );
}

function ErrorState({ message }: { message: string | null }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-10">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <svg
          className="h-8 w-8 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>Error</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <FormHeader
        title="Activation Failed"
        subtitle={
          message ||
          'Unable to activate your account. The link may be invalid or expired.'
        }
      />
      <div className="flex flex-col items-center gap-3">
        <Link href="/login">
          <Button className="h-[2.625rem] w-[17.5rem] rounded-sm bg-foreground text-background hover:bg-foreground/90">
            Go to Login
          </Button>
        </Link>
        <p className="text-center text-muted-foreground text-sm">
          If you continue to have issues, please try logging in and request a
          new activation email.
        </p>
      </div>
    </div>
  );
}
