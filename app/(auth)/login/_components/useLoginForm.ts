'use client';

import { useRouter } from 'next/navigation';
import { useFormValidation } from '@/components/headless/form';
import { useAuthStore } from '@/stores';
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
      router.push('/');
    }
  };

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (result.success) {
      router.push('/');
    }
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
