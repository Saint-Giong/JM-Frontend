'use client';

import { Badge } from '@saint-giong/bamboo-ui';
import { Crown, Sparkles } from 'lucide-react';

interface SubscriptionHeaderProps {
  isPremium: boolean;
}

export function SubscriptionHeader({ isPremium }: SubscriptionHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/20">
          <Crown className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-2xl tracking-tight">
              Subscription
            </h1>
            {isPremium && (
              <Badge className="border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/25">
                <Sparkles className="mr-1 h-3 w-3" />
                Premium
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            {isPremium
              ? 'Manage your premium features and search profiles'
              : 'Upgrade to unlock powerful recruitment tools'}
          </p>
        </div>
      </div>
    </header>
  );
}
