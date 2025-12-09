'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@saint-giong/bamboo-ui';
import { cn } from '@saint-giong/bamboo-ui/utils';
import { ArrowRight, Check, Crown, Sparkles, X } from 'lucide-react';
import { freeFeatures, premiumFeaturesList } from './constants';

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
        {/* Free Plan */}
        <Card className="relative">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Free Plan
              <Badge variant="secondary" className="ml-auto">
                Current
              </Badge>
            </CardTitle>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-4xl">$0</span>
              <span className="text-muted-foreground">/forever</span>
            </div>
            <CardDescription>Basic features for small teams</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {freeFeatures.map((feature) => (
                <li key={feature.name} className="flex items-center gap-3">
                  {feature.included ? (
                    <Check className="h-5 w-5 shrink-0 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 shrink-0 text-muted-foreground/50" />
                  )}
                  <span
                    className={cn(
                      !feature.included && 'text-muted-foreground/60'
                    )}
                  >
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="relative border-2 border-amber-500/50 bg-gradient-to-b from-amber-50/50 to-background shadow-xl dark:from-amber-950/20">
          {/* Popular Badge */}
          <div className="-translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2">
            <Badge className="border-0 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1 text-white shadow-lg">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Recommended
            </Badge>
          </div>

          <CardHeader className="pt-8">
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              Premium Plan
            </CardTitle>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-4xl">$29</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <CardDescription>
              Everything you need to hire faster
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {premiumFeaturesList.map((feature) => (
                <li key={feature.name} className="flex items-center gap-3">
                  <Check className="h-5 w-5 shrink-0 text-green-500" />
                  <span>{feature.name}</span>
                </li>
              ))}
            </ul>

            <Button
              className="mt-6 w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
              onClick={onUpgrade}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Upgrade to Premium'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
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
