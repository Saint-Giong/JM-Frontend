'use client';

import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
}

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: readonly Step[];
}

export function StepIndicator({
  currentStep,
  totalSteps,
  steps,
}: StepIndicatorProps) {
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
