'use client';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@saint-giong/bamboo-ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Form,
  FormActions,
  FormHeader,
  FormSubmitButton,
} from '@/components/common/Form';
import { useAuthStore } from '@/stores';

export default function VerifyForm() {
  const router = useRouter();
  const {
    verifyAccount,
    resendOtp,
    isLoading,
    error,
    fieldErrors,
    clearError,
  } = useAuthStore();
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp.length !== 6) return;

    const result = await verifyAccount(otp);
    if (result.success) {
      setIsVerified(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }
  };

  const handleResendOtp = async () => {
    clearError();
    const result = await resendOtp();
    if (result.success) {
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    }
  };

  if (isVerified) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>Check</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="font-semibold text-xl">Account Verified!</h2>
        <p className="text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormHeader
        title="Verify Your Account"
        subtitle="Enter the 6-digit code sent to your email"
      />

      {(error || fieldErrors) && (
        <div className="space-y-1 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-600 text-sm">
          {error && <div>{error}</div>}
          {fieldErrors &&
            Object.entries(fieldErrors).map(([field, message]) => (
              <div key={field}>
                <strong className="capitalize">{field}:</strong> {message}
              </div>
            ))}
        </div>
      )}

      {resendSuccess && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-600 text-sm">
          OTP sent successfully! Check your email.
        </div>
      )}

      <div className="flex justify-center py-6">
        <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <FormActions>
        <FormSubmitButton isSubmitting={isLoading} disabled={otp.length !== 6}>
          Verify Account
        </FormSubmitButton>
      </FormActions>

      <div className="pt-4 text-center">
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={isLoading}
          className="text-muted-foreground text-sm underline hover:text-foreground"
        >
          Didn&apos;t receive the code? Resend OTP
        </button>
      </div>
    </Form>
  );
}
