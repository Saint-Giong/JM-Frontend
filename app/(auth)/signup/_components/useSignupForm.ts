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
  const { signup, signupWithGoogle, isLoading, error, clearError } =
    useAuthStore();
  const form = useFormValidation(signupSchema, initialValues);
  const [currentStep, setCurrentStep] = useState(1);

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
      return !!form.values.country;
    }
    // Step 3 has no required fields
    return true;
  }, [form.values, form.errors, currentStep]);

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

    // If not on final step, go to next
    if (currentStep < totalSteps) {
      goToNextStep();
      return;
    }

    // Final step - submit form
    const data = form.validate();
    if (data) {
      const result = await signup(data);
      if (result.success) {
        router.push('/');
      }
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
  };
}
