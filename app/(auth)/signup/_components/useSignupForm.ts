'use client';

import { useFormValidation } from '@/components/headless/form';
import { useAuthStore } from '@/stores';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { passwordRequirements, signupSchema } from '../api/schema';

export const SIGNUP_STEPS = [
  { id: 1, title: 'Account', fields: ['email', 'password'] },
  {
    id: 2,
    title: 'Company',
    fields: ['companyName', 'country', 'dialCode', 'phoneNumber'],
  },
  { id: 3, title: 'Location', fields: ['city', 'address'] },
  { id: 4, title: 'Verify', fields: [] },
] as const;

const initialValues = {
  companyName: '',
  email: '',
  password: '',
  country: '',
  dialCode: '',
  phoneNumber: '',
  city: '',
  address: '',
};

/**
 * Multi-step signup form hook
 */
export function useSignupForm() {
  const router = useRouter();
  const {
    signup,
    loginWithGoogle,
    verifyAccount,
    resendOtp,
    isLoading: authLoading,
    error: authError,
    fieldErrors: authFieldErrors,
    clearError,
  } = useAuthStore();
  const form = useFormValidation(signupSchema, initialValues);
  const [currentStep, setCurrentStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const clearLocalError = () => setError(null);

  const totalSteps = SIGNUP_STEPS.length;

  // Compute password requirements with met status
  const computedPasswordRequirements = useMemo(
    () =>
      passwordRequirements.map((req) => ({
        ...req,
        met: req.regex.test(form.values.password),
      })),
    [form.values.password]
  );

  const allPasswordRequirementsMet = computedPasswordRequirements.every(
    (req) => req.met
  );

  // Check if current step is valid for enabling next button
  const isCurrentStepValid = useMemo((): boolean => {
    if (currentStep === 1) {
      const hasEmail = !!form.values.email && !form.errors.email;
      const hasPassword = !!form.values.password && !form.errors.password;
      return hasEmail && hasPassword && allPasswordRequirementsMet;
    }
    if (currentStep === 2) {
      const hasCompanyName =
        !!form.values.companyName && !form.errors.companyName;
      const hasCountry = !!form.values.country;
      // Phone number validation: if provided, must be digits only and less than 13 digits
      const phoneNumber = form.values.phoneNumber ?? '';
      const isPhoneValid =
        !phoneNumber || (/^\d+$/.test(phoneNumber) && phoneNumber.length < 13);
      return hasCompanyName && hasCountry && isPhoneValid;
    }
    if (currentStep === 3) {
      // Step 3 has no required fields
      return true;
    }
    if (currentStep === 4) {
      // OTP must be 6 digits
      return otp.length === 6;
    }
    return true;
  }, [form.values, form.errors, currentStep, otp, allPasswordRequirementsMet]);

  const goToNextStep = () => {
    if (currentStep < totalSteps && isCurrentStepValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Step 3 -> Step 4: Create account and show verification
    if (currentStep === 3) {
      const data = form.validate();
      if (data) {
        setIsLoading(true);
        setError(null);
        const result = await signup(data);
        setIsLoading(false);
        if (result.success) {
          // Account created, proceed to verification step
          goToNextStep();
        } else if (authError) {
          setError(authError);
        }
      }
      return;
    }

    // Step 4: Verify OTP
    if (currentStep === 4) {
      if (otp.length === 6) {
        setIsLoading(true);
        setError(null);
        const result = await verifyAccount(otp);
        setIsLoading(false);
        if (result.success) {
          setIsVerified(true);
          // Show success state briefly before redirecting
          setTimeout(() => {
            router.push('/');
          }, 1500);
        } else if (authError) {
          setError(authError);
        }
      }
      return;
    }

    // Other steps - go to next
    if (currentStep < totalSteps) {
      goToNextStep();
      return;
    }
  };

  const handleGoogleSignup = async () => {
    // This will redirect to Google OAuth
    await loginWithGoogle();
  };

  const handleResendOtp = async () => {
    setError(null);
    const result = await resendOtp();
    if (!result.success && authError) {
      setError(authError);
    }
  };

  return {
    form,
    handleSubmit,
    isSubmitting: isLoading || authLoading,
    signupError: error || authError,
    clearError: () => {
      clearLocalError();
      clearError();
    },
    handleGoogleSignup,
    passwordRequirements: computedPasswordRequirements,
    // Errors
    fieldErrors: authFieldErrors,
    // Multi-step
    currentStep,
    totalSteps,
    steps: SIGNUP_STEPS,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    isCurrentStepValid,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    // OTP verification
    otp,
    setOtp,
    isVerified,
    handleResendOtp,
  };
}
