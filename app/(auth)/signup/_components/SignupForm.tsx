'use client';

import { useEffect } from 'react';
import { Form } from '@/components/common/Form';
import { clearAuthStorage } from '@/stores';
import { SignupFormActions } from './signup-form-actions';
import { StepIndicator } from './step-indicator';
import { StepTitle } from './step-title';
import { AccountStep, CompanyStep, LocationStep, VerifyStep } from './steps';
import { useSignupForm } from './useSignupForm';

export default function SignupForm() {
  // Clear cached auth storage on mount to ensure clean signup state
  useEffect(() => {
    clearAuthStorage();
  }, []);

  const {
    form,
    handleSubmit,
    isSubmitting,
    handleGoogleSignup,
    passwordRequirements,
    signupError,
    fieldErrors,
    currentStep,
    totalSteps,
    steps,
    goToPreviousStep,
    isCurrentStepValid,
    isFirstStep,
    otp,
    setOtp,
    isVerified,
    isGoogleSignup,
  } = useSignupForm();

  const currentStepConfig = steps.find((s) => s.id === currentStep);

  return (
    <Form onSubmit={handleSubmit}>
      <StepIndicator
        currentStep={currentStep}
        totalSteps={totalSteps}
        steps={steps}
      />

      {currentStepConfig && (
        <StepTitle title={currentStepConfig.title} email={form.values.email} />
      )}

      {(signupError || fieldErrors) && (
        <div className="space-y-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-600 text-sm">
          {signupError && <div>{signupError}</div>}
          {fieldErrors &&
            Object.entries(fieldErrors).map(([field, message]) => (
              <div key={field}>
                <strong className="capitalize">{field}:</strong> {message}
              </div>
            ))}
          {/* Show restart button for session expiry errors */}
          {isGoogleSignup && signupError?.toLowerCase().includes('session') && (
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="mt-2 font-medium text-red-700 underline hover:text-red-800"
            >
              Try Google Sign-up Again
            </button>
          )}
        </div>
      )}

      <div className="min-h-[200px] space-y-5 pt-4">
        {currentStep === 1 && (
          <AccountStep
            email={form.values.email}
            password={form.values.password}
            emailError={form.errors.email}
            passwordRequirements={passwordRequirements}
            onEmailChange={(e) => form.setValue('email', e.target.value)}
            onEmailBlur={() => form.setFieldTouched('email')}
            onPasswordChange={(e) => form.setValue('password', e.target.value)}
            onPasswordBlur={() => form.setFieldTouched('password')}
            isGoogleSignup={isGoogleSignup}
          />
        )}

        {currentStep === 2 && (
          <CompanyStep
            companyName={form.values.companyName}
            companyNameError={form.errors.companyName}
            country={form.values.country}
            dialCode={form.values.dialCode ?? ''}
            phoneNumber={form.values.phoneNumber ?? ''}
            phoneError={form.errors.phoneNumber}
            onCompanyNameChange={(e) =>
              form.setValue('companyName', e.target.value)
            }
            onCompanyNameBlur={() => form.setFieldTouched('companyName')}
            onCountryNameChange={(name) => form.setValue('country', name)}
            onDialCodeChange={(code) => form.setValue('dialCode', code)}
            onPhoneNumberChange={(num) => form.setValue('phoneNumber', num)}
          />
        )}

        {currentStep === 3 && (
          <LocationStep
            city={form.values.city ?? ''}
            address={form.values.address ?? ''}
            onCityChange={(e) => form.setValue('city', e.target.value)}
            onCityBlur={() => form.setFieldTouched('city')}
            onAddressChange={(e) => form.setValue('address', e.target.value)}
            onAddressBlur={() => form.setFieldTouched('address')}
          />
        )}

        {currentStep === 4 && (
          <VerifyStep
            otp={otp}
            isVerified={isVerified}
            isSubmitting={isSubmitting}
            onOtpChange={setOtp}
          />
        )}
      </div>

      {!isVerified && (
        <SignupFormActions
          currentStep={currentStep}
          isFirstStep={isFirstStep}
          isSubmitting={isSubmitting}
          isCurrentStepValid={isCurrentStepValid}
          onPreviousStep={goToPreviousStep}
          onGoogleSignup={handleGoogleSignup}
          isGoogleSignup={isGoogleSignup}
        />
      )}
    </Form>
  );
}
