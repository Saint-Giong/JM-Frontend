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
  const { form, handleSubmit, isSubmitting, handleGoogleLogin, loginError } =
    useLoginForm();

  return (
    <Form onSubmit={handleSubmit}>
      <FormHeader title="Welcome!" subtitle="Please enter your details." />

      {loginError && <p className="text-red-500 text-sm">{loginError}</p>}

      <div className="space-y-6 pt-4">
        <div>
          <FormInput
            label="Email"
            type="email"
            placeholder="example@email.com"
            required
            {...form.getFieldProps('email')}
          />
        </div>

        <div className="space-y-1">
          <FormInput
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            minLength={8}
            {...form.getFieldProps('password')}
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
