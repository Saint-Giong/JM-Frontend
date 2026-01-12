'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { CountryPhoneRow } from '@/components/common/CountryPhoneRow';
import {
  Form,
  FormActions,
  FormHeader,
  FormInput,
  FormSubmitButton,
} from '@/components/common/Form';
import { authApi } from '@/lib/api';
import { HttpError } from '@/lib/http';
import { useAuthStore } from '@/stores/auth';

interface FormData {
  email: string;
  name: string;
  companyName: string;
  country: string;
  dialCode: string;
  phoneNumber: string;
  city: string;
  address: string;
}

function GoogleSignupFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchCompanyProfile } = useAuthStore();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    companyName: '',
    country: '',
    dialCode: '+1',
    phoneNumber: '',
    city: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill email and name from URL params (from Google OAuth)
  useEffect(() => {
    const email = searchParams.get('email');
    const name = searchParams.get('name');

    if (email || name) {
      setFormData((prev) => ({
        ...prev,
        email: email || prev.email,
        name: name || prev.name,
        companyName: name || prev.companyName, // Default company name to user's name
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.companyName || !formData.country || !formData.phoneNumber) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await authApi.googleRegister({
        email: formData.email,
        companyName: formData.companyName,
        country: formData.country,
        phoneNumber: `${formData.dialCode}${formData.phoneNumber}`,
        city: formData.city || '',
        address: formData.address || undefined,
        tempToken: searchParams.get('tempToken') || undefined, // Pass tempToken from URL
      });

      if (result.success) {
        // Update auth state and redirect to dashboard
        useAuthStore.setState({
          isAuthenticated: true,
          isActivated: true,
          companyId: result.data?.companyId || null,
          userEmail: result.data?.email || formData.email,
        });

        // Fetch company profile
        await fetchCompanyProfile();

        router.push('/dashboard');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      if (err instanceof HttpError) {
        const errorData = err.data as { message?: string } | null;
        setError(errorData?.message || 'Registration failed');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = <K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormHeader
        title="Complete Your Signup"
        subtitle="Just a few more details to set up your company."
      />

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-600 text-sm">
          <div>{error}</div>
          {/* Show restart button for session expiry errors */}
          {error?.toLowerCase().includes('session') && (
            <button
              type="button"
              onClick={() => useAuthStore.getState().loginWithGoogle()}
              className="mt-2 font-medium text-red-700 underline hover:text-red-800"
            >
              Try Google Sign-up Again
            </button>
          )}
        </div>
      )}

      <div className="space-y-5 pt-4">
        {/* Email - Read-only from Google */}
        <FormInput
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          disabled
          className="cursor-not-allowed bg-muted"
        />

        {/* Company Name */}
        <FormInput
          id="companyName"
          label="Company Name"
          type="text"
          placeholder="Your company name"
          value={formData.companyName}
          onChange={(e) => updateField('companyName', e.target.value)}
          required
        />

        {/* Country and Phone Number */}
        <CountryPhoneRow
          countryValue={formData.country}
          dialCode={formData.dialCode}
          phoneNumber={formData.phoneNumber}
          onCountryNameChange={(name: string) => updateField('country', name)}
          onDialCodeChange={(code: string) => updateField('dialCode', code)}
          onPhoneNumberChange={(num: string) => updateField('phoneNumber', num)}
        />

        {/* City */}
        <FormInput
          id="city"
          label="City"
          type="text"
          placeholder="Your city"
          value={formData.city}
          onChange={(e) => updateField('city', e.target.value)}
        />

        {/* Address */}
        <FormInput
          id="address"
          label="Address"
          type="text"
          placeholder="Your address (optional)"
          value={formData.address}
          onChange={(e) => updateField('address', e.target.value)}
        />
      </div>

      <FormActions>
        <FormSubmitButton isSubmitting={isSubmitting}>
          Complete Registration
        </FormSubmitButton>
      </FormActions>
    </Form>
  );
}

export default function GoogleSignupForm() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      }
    >
      <GoogleSignupFormContent />
    </Suspense>
  );
}
