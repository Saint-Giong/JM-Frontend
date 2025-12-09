'use client';

import { Check } from 'lucide-react';
import { FreePlanCard } from './free-plan-card';
import { PremiumPlanCard } from './premium-plan-card';

interface PlanComparisonProps {
  isProcessing: boolean;
  onUpgrade: () => void;
}

export function PlanComparison({
  isProcessing,
  onUpgrade,
}: PlanComparisonProps) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h3 className="mb-8 text-center font-semibold text-2xl">Compare Plans</h3>

      <div className="grid gap-6 md:grid-cols-2">
        <FreePlanCard />
        <PremiumPlanCard isProcessing={isProcessing} onUpgrade={onUpgrade} />
      </div>

      {/* Trust Indicators */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-center text-muted-foreground text-sm">
        <span className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          Secure payment via Stripe
        </span>
        <span className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          Cancel anytime
        </span>
        <span className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          24/7 Support
        </span>
      </div>
    </div>
  );
}
