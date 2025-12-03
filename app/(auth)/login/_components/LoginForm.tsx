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
import { useAsyncAction } from '@/components/headless/form';
import { loginWithGoogle } from '../api/login';

export default function LoginForm() {
    const { execute: handleGoogleLogin } = useAsyncAction(loginWithGoogle);

    return (
        <Form>
            <FormHeader
                title="Welcome!"
                subtitle="Please enter your details."
            />

            <div className="space-y-6 pt-4">
                <FormInput
                    label="Email"
                    type="email"
                    placeholder="example@email.com"
                    required
                />

                <div className="space-y-1">
                    <FormInput
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        required
                    />
                    <div className="flex justify-end">
                        <FormLink href="/forgot-password">
                            Forgot password?
                        </FormLink>
                    </div>
                </div>
            </div>

            <FormActions>
                <FormSubmitButton>Log in</FormSubmitButton>
                <GoogleSSOButton onAuth={handleGoogleLogin}>
                    Log in with Google
                </GoogleSSOButton>
            </FormActions>
        </Form>
    );
}
