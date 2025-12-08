'use client';

import {
    Form,
    FormHeader,
    FormInput,
    FormActions,
    FormSubmitButton,
} from '@/components/common/Form';
import { CountryPhoneRow } from '@/components/common/CountryPhoneRow';
import { GoogleSSOButton } from '@/app/(auth)/_components/SSOButton';
import { useSignupForm } from './useSignupForm';
import { X } from 'lucide-react';

export default function SignupForm() {
    const { form, handleSubmit, isSubmitting, handleGoogleSignup, passwordRequirements, signupError } = useSignupForm();

    return (
        <Form onSubmit={handleSubmit}>
            <FormHeader
                title="Create account"
                subtitle="Enter your details to get started."
            />

            {signupError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {signupError}
                </div>
            )}

            <div className="space-y-5 pt-4">
                {/* Company Name */}
                <FormInput
                    label="Company Name"
                    type="text"
                    placeholder="Type here"
                    {...form.getFieldProps('companyName')}
                />

                {/* Email */}
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

                {/* Password with requirements */}
                <div className="flex gap-6">
                    <div className="flex-1">
                        <FormInput
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            required
                            {...form.getFieldProps('password')}
                        />
                    </div>
                    <div className="w-52 text-xs">
                        <p className="font-medium text-muted-foreground mb-1">Password requirements:</p>
                        <ul className="space-y-0.5">
                            {passwordRequirements.map((req, i) => (
                                <li key={i} className="flex items-center gap-1">
                                    <X className={`h-3 w-3 ${req.met ? 'text-green-500' : 'text-red-500'}`} />
                                    <span className={req.met ? 'text-green-600' : 'text-muted-foreground'}>
                                        {req.label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Country and Phone */}
                <CountryPhoneRow
                    countryValue={form.values.country}
                    dialCode={form.values.dialCode ?? ''}
                    phoneNumber={form.values.phoneNumber ?? ''}
                    phoneError={form.errors.phoneNumber}
                    onCountryNameChange={(name) => form.setValue('country', name)}
                    onDialCodeChange={(code) => form.setValue('dialCode', code)}
                    onPhoneNumberChange={(num) => form.setValue('phoneNumber', num)}
                />

                {/* City and Address */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <FormInput
                            label="City"
                            type="text"
                            placeholder="Type here"
                            {...form.getFieldProps('city')}
                        />
                    </div>
                    <div className="flex-1">
                        <FormInput
                            label="Address"
                            type="text"
                            placeholder="Type here"
                            {...form.getFieldProps('address')}
                        />
                    </div>
                </div>
            </div>

            <FormActions>
                <FormSubmitButton isSubmitting={isSubmitting} disabled={!form.isValid}>
                    Create account
                </FormSubmitButton>
                <GoogleSSOButton onAuth={handleGoogleSignup}>
                    Sign up with Google
                </GoogleSSOButton>
            </FormActions>
        </Form>
    );
}
