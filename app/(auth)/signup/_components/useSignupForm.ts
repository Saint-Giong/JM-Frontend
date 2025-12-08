'use client';

import { useRouter } from 'next/navigation';
import { useFormValidation } from '@/components/headless/form';
import { useAuthStore } from '@/stores';
import { signupSchema, passwordRequirements } from '../api/schema';

const initialValues = {
  companyName: '',
  email: '',
  password: '',
  country: '',
  phoneCode: '',
  phoneNumber: '',
  city: '',
  address: '',
};

/**
 * Signup form hook
 */
export function useSignupForm() {
  const router = useRouter();
  const { signup, signupWithGoogle, isLoading, error, clearError } =
    useAuthStore();
  const form = useFormValidation(signupSchema, initialValues);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
  };
}
