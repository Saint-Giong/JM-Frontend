'use client';

import { useAsyncAction, useFormValidation } from '@/components/headless/form';
import { signup, signupWithGoogle } from '../api/signup';
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
 * Headless hook for signup form
 */
export function useSignupForm() {
    const form = useFormValidation(signupSchema, initialValues);
    const signupAction = useAsyncAction(signup);
    const googleAction = useAsyncAction(signupWithGoogle);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = form.validate();
        if (data) {
            await signupAction.execute(data);
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
        isSubmitting: signupAction.isLoading,
        handleGoogleSignup: googleAction.execute,
        isGoogleLoading: googleAction.isLoading,
        passwordRequirements: getPasswordRequirements(),
    };
}

