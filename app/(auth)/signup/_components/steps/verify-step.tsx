'use client';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@saint-giong/bamboo-ui';
import { Check, Mail } from 'lucide-react';

interface VerifyStepProps {
  otp: string;
  isVerified: boolean;
  isSubmitting: boolean;
  onOtpChange: (value: string) => void;
}

export function VerifyStep({
  otp,
  isVerified,
  isSubmitting,
  onOtpChange,
}: VerifyStepProps) {
  if (isVerified) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <Check className="h-8 w-8 text-green-500" />
        </div>
        <div className="text-center">
          <p className="font-medium text-foreground">
            Email verified successfully!
          </p>
          <p className="mt-1 text-muted-foreground text-sm">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Mail className="h-8 w-8 text-primary" />
      </div>
      <p className="text-center text-muted-foreground text-sm">
        Enter the 6-digit code we sent to your email address to verify your
        account.
      </p>
      <InputOTP
        maxLength={6}
        value={otp}
        onChange={onOtpChange}
        disabled={isSubmitting}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-center text-muted-foreground text-xs">
        Didn&apos;t receive the code?{' '}
        <button
          type="button"
          className="text-primary underline-offset-4 hover:underline"
        >
          Resend
        </button>
      </p>
    </div>
  );
}
