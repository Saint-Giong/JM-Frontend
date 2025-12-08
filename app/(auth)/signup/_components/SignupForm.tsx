'use client';

import { GoogleSSOButton } from '@/app/(auth)/_components/SSOButton';
import { CountryPhoneRow } from '@/components/common/CountryPhoneRow';
import {
  Form,
  FormActions,
  FormHeader,
  FormInput,
  FormSubmitButton,
} from '@/components/common/Form';
import { Button } from '@saint-giong/bamboo-ui';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useSignupForm } from './useSignupForm';

function StepIndicator({
  currentStep,
  totalSteps,
  steps,
}: {
  currentStep: number;
  totalSteps: number;
  steps: readonly { id: number; title: string }[];
}) {
  return (
    <div className="mb-6 flex items-center justify-center gap-2">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full font-medium text-sm transition-colors ${
              step.id === currentStep
                ? 'bg-foreground text-background'
                : step.id < currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-muted text-muted-foreground'
            }`}
          >
            {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
          </div>
          {index < totalSteps - 1 && (
            <div
              className={`mx-2 h-0.5 w-8 ${
                step.id < currentStep ? 'bg-green-500' : 'bg-muted'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function StepTitle({ step }: { step: { title: string } }) {
  const subtitles: Record<string, string> = {
    Account: 'Set up your login credentials.',
    Company: 'Tell us about your company.',
    Location: 'Where is your company located?',
  };

  return <FormHeader title={step.title} subtitle={subtitles[step.title]} />;
}

export default function SignupForm() {
  const {
    form,
    handleSubmit,
    isSubmitting,
    handleGoogleSignup,
    passwordRequirements,
    signupError,
    currentStep,
    totalSteps,
    steps,
    goToPreviousStep,
    isCurrentStepValid,
    isFirstStep,
    isLastStep,
  } = useSignupForm();

  const currentStepConfig = steps.find((s) => s.id === currentStep);

  return (
    <Form onSubmit={handleSubmit}>
      <StepIndicator
        currentStep={currentStep}
        totalSteps={totalSteps}
        steps={steps}
      />

      {currentStepConfig && <StepTitle step={currentStepConfig} />}

      {signupError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-600 text-sm">
          {signupError}
        </div>
      )}

      <div className="min-h-[200px] space-y-5 pt-4">
        {/* Step 1: Account Details */}
        {currentStep === 1 && (
          <>
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
                <p className="mt-1 text-red-500 text-sm">{form.errors.email}</p>
              )}
            </div>

            {/* Password with requirements */}
            <div className="flex gap-6">
              <div className="flex-1">
                <FormInput
                  label="Password"
                  type="password"
                  placeholder="Create a strong password"
                  required
                  {...form.getFieldProps('password')}
                />
              </div>
              <div className="w-52 text-xs">
                <p className="mb-1 font-medium text-muted-foreground">
                  Password requirements:
                </p>
                <ul className="space-y-0.5">
                  {passwordRequirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-1">
                      {req.met ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <X className="h-3 w-3 text-red-500" />
                      )}
                      <span
                        className={
                          req.met ? 'text-green-600' : 'text-muted-foreground'
                        }
                      >
                        {req.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Company Information */}
        {currentStep === 2 && (
          <>
            {/* Company Name */}
            <FormInput
              label="Company Name"
              type="text"
              placeholder="Your company name"
              {...form.getFieldProps('companyName')}
            />

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
          </>
        )}

        {/* Step 3: Location Details */}
        {currentStep === 3 && (
          <>
            <FormInput
              label="City"
              type="text"
              placeholder="e.g. San Francisco"
              {...form.getFieldProps('city')}
            />
            <FormInput
              label="Address"
              type="text"
              placeholder="Street address (optional)"
              {...form.getFieldProps('address')}
            />
          </>
        )}
      </div>

      <FormActions>
        <div className="flex w-full items-center justify-center gap-4">
          {!isFirstStep ? (
            <Button
              type="button"
              variant="ghost"
              onClick={goToPreviousStep}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          ) : null}

          <FormSubmitButton
            isSubmitting={isSubmitting}
            disabled={!isCurrentStepValid}
          >
            {isLastStep ? 'Create account' : 'Continue'}
          </FormSubmitButton>
        </div>

        {isFirstStep && (
          <GoogleSSOButton onAuth={handleGoogleSignup}>
            Sign up with Google
          </GoogleSSOButton>
        )}
      </FormActions>
    </Form>
  );
}
