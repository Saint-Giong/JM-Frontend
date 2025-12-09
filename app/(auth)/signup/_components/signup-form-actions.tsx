'use client';

import { GoogleSSOButton } from '@/app/(auth)/_components/SSOButton';
import { FormActions, FormSubmitButton } from '@/components/common/Form';
import { Button } from '@saint-giong/bamboo-ui';
import { ArrowLeft } from 'lucide-react';

const buttonLabels: Record<number, string> = {
  3: 'Create account',
  4: 'Verify Email',
};

interface SignupFormActionsProps {
  currentStep: number;
  isFirstStep: boolean;
  isSubmitting: boolean;
  isCurrentStepValid: boolean;
  onPreviousStep: () => void;
  onGoogleSignup: () => void;
}

export function SignupFormActions({
  currentStep,
  isFirstStep,
  isSubmitting,
  isCurrentStepValid,
  onPreviousStep,
  onGoogleSignup,
}: SignupFormActionsProps) {
  const buttonLabel = buttonLabels[currentStep] ?? 'Continue';

  return (
    <FormActions>
      <div className="flex w-full items-center justify-center gap-4">
        {!isFirstStep && (
          <Button
            type="button"
            variant="ghost"
            onClick={onPreviousStep}
            className="gap-2"
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}

        <FormSubmitButton
          isSubmitting={isSubmitting}
          disabled={!isCurrentStepValid}
        >
          {buttonLabel}
        </FormSubmitButton>
      </div>

      {isFirstStep && (
        <GoogleSSOButton onAuth={onGoogleSignup}>
          Sign up with Google
        </GoogleSSOButton>
      )}
    </FormActions>
  );
}
