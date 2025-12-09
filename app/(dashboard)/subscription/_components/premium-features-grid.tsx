'use client';

import { Card, CardContent } from '@saint-giong/bamboo-ui';
import { premiumFeatures } from './constants';

export function PremiumFeaturesGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {premiumFeatures.map((feature) => (
        <Card
          key={feature.title}
          className="group transition-all hover:shadow-md"
        >
          <CardContent className="flex items-start gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
              <feature.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">{feature.title}</h4>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
