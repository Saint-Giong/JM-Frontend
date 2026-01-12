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
import { ArrowRight, Check, Crown, Sparkles } from 'lucide-react';
import { type PlanFeature, premiumFeaturesList } from '@/mocks/subscription';

interface PremiumPlanCardProps {
  features?: PlanFeature[];
  isProcessing?: boolean;
  onUpgrade?: () => void;
}

export function PremiumPlanCard({
  features = premiumFeaturesList,
  isProcessing = false,
  onUpgrade,
}: PremiumPlanCardProps) {
  return (
    <Card className="relative border-2 border-amber-500/50 bg-gradient-to-b from-amber-50/50 to-background shadow-xl dark:from-amber-950/20">
      {/* Recommended Badge */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
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
        <CardDescription>Everything you need to hire faster</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature.name} className="flex items-center gap-3">
              <Check className="h-5 w-5 shrink-0 text-green-500" />
              <span>{feature.name}</span>
            </li>
          ))}
        </ul>

        {onUpgrade && (
          <Button
            className="mt-6 w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
            onClick={onUpgrade}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Upgrade to Premium'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
