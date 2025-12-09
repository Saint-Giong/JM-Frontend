'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useFormValidation } from '@/components/headless/form';
import type { MockUser } from '@/mocks/users';
import { useAuthStore } from '@/stores';
import { passwordRequirements, signupSchema } from '../api/schema';
import { signup } from '../api/signup';

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
  const { signupWithGoogle, setUser } = useAuthStore();
  const form = useFormValidation(signupSchema, initialValues);
  const [currentStep, setCurrentStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  // Store pending user until OTP verification is complete
  const [pendingUser, setPendingUser] = useState<Omit<
    MockUser,
    'password'
  > | null>(null);

  const clearError = () => setError(null);

  const totalSteps = SIGNUP_STEPS.length;

  // Check if current step is valid for enabling next button
  const isCurrentStepValid = useMemo(() => {
    if (currentStep === 1) {
      const hasEmail = form.values.email && !form.errors.email;
      const hasPassword = form.values.password && !form.errors.password;
      // Check all password requirements are met
      const passwordReqs = passwordRequirements.every((req) =>
        req.regex.test(form.values.password)
      );
      return hasEmail && hasPassword && passwordReqs;
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
  }, [form.values, form.errors, currentStep, otp]);

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
        if (result.success && result.user) {
          // Store user temporarily, don't set in auth store yet
          setPendingUser(result.user);
          // Account created, proceed to verification step
          goToNextStep();
        } else if (result.error) {
          setError(result.error);
        }
      }
      return;
    }

    // Step 4: Verify OTP (any code works for now)
    if (currentStep === 4) {
      if (otp.length === 6 && pendingUser) {
        // Mock verification - any 6-digit code is accepted
        setIsLoading(true);
        // Simulate verification delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsLoading(false);
        setIsVerified(true);
        // Show success state briefly before redirecting
        setTimeout(() => {
          setUser(pendingUser);
          router.push('/');
        }, 1500);
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
    const result = await signupWithGoogle();
    if (result.success) {
      router.push('/');
    }
  };

  // Check password requirements
  const getPasswordRequirements = () => {
    const password = form.values.password;
    return passwordRequirements.map((req) => ({
      ...req,
      met: req.regex.test(password),
    }));
  };

  return {
    form,
    handleSubmit,
    isSubmitting: isLoading,
    signupError: error,
    clearError,
    handleGoogleSignup,
    passwordRequirements: getPasswordRequirements(),
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
  };
}
