'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useFormValidation } from '@/components/headless/form';
import { authApi } from '@/lib/api';
import { HttpError } from '@/lib/http';
import { useAuthStore } from '@/stores';
import {
  googleSignupSchema,
  passwordRequirements,
  signupSchema,
} from '../api/schema';

const BASE_SIGNUP_STEPS = [
  { id: 1, title: 'Account', fields: ['email', 'password'] },
  {
    id: 2,
    title: 'Company',
    fields: ['companyName', 'country', 'dialCode', 'phoneNumber'],
  },
  { id: 3, title: 'Location', fields: ['city', 'address'] },
] as const;

const VERIFY_STEP = { id: 4, title: 'Verify', fields: [] } as const;

// For SSO signup, skip the Verify step (Google already verified email)
export const getSignupSteps = (isGoogleSignup: boolean) =>
  isGoogleSignup
    ? BASE_SIGNUP_STEPS
    : ([...BASE_SIGNUP_STEPS, VERIFY_STEP] as const);

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
  const searchParams = useSearchParams();
  const {
    signup,
    loginWithGoogle,
    verifyAccount,
    resendOtp,
    isLoading: authLoading,
    error: authError,
    fieldErrors: authFieldErrors,
    clearError,
    fetchCompanyProfile,
  } = useAuthStore();
  const form = useFormValidation(signupSchema, initialValues);
  const [currentStep, setCurrentStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  // Detect Google signup mode from URL params
  const isGoogleSignup = searchParams.get('google') === 'true';
  const googleEmail = searchParams.get('email') || '';

  // Prefill form with Google data (only email, NOT company name - Google name is personal, not company)
  // biome-ignore lint/correctness/useExhaustiveDependencies: form.setValue is stable
  useEffect(() => {
    if (isGoogleSignup && googleEmail) {
      form.setValue('email', googleEmail);
    }
  }, [isGoogleSignup, googleEmail]);

  const clearLocalError = () => setError(null);

  const steps = useMemo(() => getSignupSteps(isGoogleSignup), [isGoogleSignup]);
  const totalSteps = steps.length;

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
      // For Google signup, skip password validation
      if (isGoogleSignup) {
        return hasEmail;
      }
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
  }, [
    form.values,
    form.errors,
    currentStep,
    otp,
    allPasswordRequirementsMet,
    isGoogleSignup,
  ]);

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
      // For Google signup, use googleSignupSchema (no password required)
      // For regular signup, use the regular signupSchema
      const validationSchema = isGoogleSignup
        ? googleSignupSchema
        : signupSchema;
      const validationResult = validationSchema.safeParse(form.values);

      if (!validationResult.success) {
        // Set errors from validation
        const firstError = validationResult.error.issues[0];
        setError(firstError?.message || 'Validation failed');
        return;
      }

      const data = validationResult.data;
      setIsLoading(true);
      setError(null);

      if (isGoogleSignup) {
        // Google signup: use googleRegister API (no password required)
        try {
          const result = await authApi.googleRegister({
            email: data.email,
            companyName: data.companyName,
            country: data.country,
            phoneNumber:
              data.dialCode && data.phoneNumber
                ? `${data.dialCode}${data.phoneNumber}`
                : null,
            city: data.city || null,
            address: data.address || null,
            tempToken: searchParams.get('tempToken') || undefined, // Pass tempToken from URL
          });

          if (result.success) {
            // Update auth state and redirect to dashboard
            useAuthStore.setState({
              isAuthenticated: true,
              isActivated: true,
              companyId: result.data?.companyId || null,
              userEmail: result.data?.email || data.email,
            });

            await fetchCompanyProfile();
            router.push('/dashboard');
          } else {
            setError(result.message || 'Registration failed');
          }
        } catch (err) {
          console.error('Google registration error:', err);
          if (err instanceof HttpError) {
            // Extract message from backend error response
            const backendError = err.data as { message?: string } | null;
            setError(
              backendError?.message || err.statusText || 'Registration failed'
            );
          } else {
            setError(
              err instanceof Error ? err.message : 'Registration failed'
            );
          }
        } finally {
          setIsLoading(false);
        }
        return;
      }

      // Regular signup flow - password is required
      if (!data.password) {
        setError('Password is required');
        setIsLoading(false);
        return;
      }

      const result = await signup({
        ...data,
        password: data.password,
      });
      setIsLoading(false);
      if (result.success) {
        // Account created, proceed to verification step
        goToNextStep();
      } else if (authError) {
        setError(authError);
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
    steps,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    isCurrentStepValid,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    // Google signup mode
    isGoogleSignup,
    // OTP verification
    otp,
    setOtp,
    isVerified,
    handleResendOtp,
  };
}
