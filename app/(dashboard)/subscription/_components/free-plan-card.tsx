'use client';

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@saint-giong/bamboo-ui';
import { cn } from '@saint-giong/bamboo-ui/utils';
import { Check, X } from 'lucide-react';
import { freeFeatures, type PlanFeature } from '@/mocks/subscription';

interface FreePlanCardProps {
  features?: PlanFeature[];
  isCurrent?: boolean;
}

export function FreePlanCard({
  features = freeFeatures,
  isCurrent = true,
}: FreePlanCardProps) {
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Free Plan
          {isCurrent && (
            <Badge variant="secondary" className="ml-auto">
              Current
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="font-serif text-4xl">$0</span>
          <span className="text-muted-foreground">/forever</span>
        </div>
        <CardDescription>Basic features for small teams</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature.name} className="flex items-center gap-3">
              {feature.included ? (
                <Check className="h-5 w-5 shrink-0 text-green-500" />
              ) : (
                <X className="h-5 w-5 shrink-0 text-muted-foreground/50" />
              )}
              <span
                className={cn(!feature.included && 'text-muted-foreground/60')}
              >
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
