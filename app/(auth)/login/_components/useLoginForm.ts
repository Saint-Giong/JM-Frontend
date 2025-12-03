'use client';

import { useAsyncAction, useFormValidation } from '@/components/headless/form';
import { login, loginWithGoogle } from '../api/login';
import { loginSchema } from '../api/schema';

/**
 * Headless hook for login form - wires validation, state, and services
 */
export function useLoginForm() {
    // Validation
    const form = useFormValidation(loginSchema, { email: '', password: '' });

    // Actions (hooks call services)
    const loginAction = useAsyncAction(login);
    const googleAction = useAsyncAction(loginWithGoogle);

    // Submit handler
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = form.validate();
        if (data) {
            await loginAction.execute(data);
        }
    };

    return {
        // Form state
        form,
        // Submit
        handleSubmit,
        isSubmitting: loginAction.isLoading,
        // Google SSO
        handleGoogleLogin: googleAction.execute,
        isGoogleLoading: googleAction.isLoading,
    };
}

