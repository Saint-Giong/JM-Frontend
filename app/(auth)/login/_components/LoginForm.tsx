'use client';

import {
    Form,
    FormHeader,
    FormInput,
    FormActions,
    FormSubmitButton,
    FormLink,
} from '@/components/common/Form';
import { GoogleSSOButton } from '@/app/(auth)/_components/SSOButton';
import { useLoginForm } from './useLoginForm';

export default function LoginForm() {
    const { form, handleSubmit, isSubmitting, handleGoogleLogin } = useLoginForm();

    return (
        <Form onSubmit={handleSubmit}>
            <FormHeader
                title="Welcome!"
                subtitle="Please enter your details."
            />

            <div className="space-y-6 pt-4">
                <div>
                    <FormInput
                        label="Email"
                        type="email"
                        placeholder="example@email.com"
                        required
                        {...form.getFieldProps('email')}
                    />
                    {form.errors.email && (
                        <p className="text-sm text-red-500 mt-1">{form.errors.email}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <FormInput
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        required
                        {...form.getFieldProps('password')}
                    />
                    {form.errors.password && (
                        <p className="text-sm text-red-500 mt-1">{form.errors.password}</p>
                    )}
                    <div className="flex justify-end">
                        <FormLink href="/forgot-password">
                            Forgot password?
                        </FormLink>
                    </div>
                </div>
            </div>

            <FormActions>
                <FormSubmitButton isSubmitting={isSubmitting} disabled={!form.isValid}>
                    Log in
                </FormSubmitButton>
                <GoogleSSOButton onAuth={handleGoogleLogin}>
                    Log in with Google
                </GoogleSSOButton>
            </FormActions>
        </Form>
    );
}
