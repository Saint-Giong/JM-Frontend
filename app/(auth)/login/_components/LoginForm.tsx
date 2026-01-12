'use client';

import { Suspense, useState } from 'react';
import { GoogleSSOButton } from '@/app/(auth)/_components/SSOButton';
import {
  Form,
  FormActions,
  FormHeader,
  FormInput,
  FormLink,
  FormSubmitButton,
} from '@/components/common/Form';
import { GoogleCallbackHandler } from './GoogleCallbackHandler';
import { useLoginForm } from './useLoginForm';

export default function LoginForm() {
  const { form, handleSubmit, isSubmitting, handleGoogleLogin, loginError } =
    useLoginForm();
  const [googleError, setGoogleError] = useState<string | null>(null);

  const displayError = googleError || loginError;

  return (
    <Form onSubmit={handleSubmit}>
      {/* Handle Google OAuth callback if URL has code/state params */}
      <Suspense fallback={null}>
        <GoogleCallbackHandler onError={setGoogleError} />
      </Suspense>

      <FormHeader title="Welcome!" subtitle="Please enter your details." />

      {displayError && <p className="text-red-500 text-sm">{displayError}</p>}

      <div className="space-y-6 pt-4">
        <FormInput
          id="email"
          label="Email"
          type="email"
          placeholder="example@email.com"
          {...form.getFieldProps('email')}
          autoComplete="email"
        />

        <div className="space-y-1">
          <FormInput
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            {...form.getFieldProps('password')}
            autoComplete="current-password"
          />
          <div className="flex justify-end">
            <FormLink href="/forgot-password">Forgot password?</FormLink>
          </div>
        </div>
      </div>

      <FormActions>
        <FormSubmitButton isSubmitting={isSubmitting}>Log in</FormSubmitButton>
        <GoogleSSOButton onAuth={handleGoogleLogin}>
          Log in with Google
        </GoogleSSOButton>
      </FormActions>
    </Form>
  );
}
