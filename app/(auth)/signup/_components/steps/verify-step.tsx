'use client';

import {
  Button,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@saint-giong/bamboo-ui';
import { Check, Mail } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const RESEND_COOLDOWN = 60;

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
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const canResend = countdown === 0 && !isResending;

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Clear success message after a delay
  useEffect(() => {
    if (!resendSuccess) return;

    const timer = setTimeout(() => {
      setResendSuccess(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [resendSuccess]);

  const handleResend = useCallback(async () => {
    if (!canResend) return;

    setIsResending(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsResending(false);
    setResendSuccess(true);
    setCountdown(RESEND_COOLDOWN);
  }, [canResend]);

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
      {resendSuccess && (
        <p className="text-center text-green-600 text-xs">
          Code sent successfully!
        </p>
      )}
      <p className="text-center text-muted-foreground text-xs">
        Didn&apos;t receive the code?{' '}
        {canResend ? (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? 'Sending...' : 'Resend'}
          </Button>
        ) : (
          <span className="text-muted-foreground">Resend in {countdown}s</span>
        )}
      </p>
    </div>
  );
}
