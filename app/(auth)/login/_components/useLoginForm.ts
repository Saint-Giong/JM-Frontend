'use client';

import { useFormValidation } from '@/components/headless/form';
import { useAuthStore } from '@/stores';
import { useRouter } from 'next/navigation';
import { loginSchema } from '../api/schema';

/**
 * Login form hook
 */
export function useLoginForm() {
  const router = useRouter();
  const { login, loginWithGoogle, isLoading, error, clearError } =
    useAuthStore();
  const form = useFormValidation(loginSchema, { email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validData = form.validate();
    if (!validData) return;

    const result = await login(validData);
    if (result.success) {
      if (result.activated) {
        router.push('/');
      } else {
        // Account needs activation - redirect to OTP verification
        router.push('/verify');
      }
    }
  };

  const handleGoogleLogin = async () => {
    // This will redirect to Google OAuth
    await loginWithGoogle();
  };

  return {
    form,
    handleSubmit,
    isSubmitting: isLoading,
    loginError: error,
    clearError,
    handleGoogleLogin,
  };
}
