'use client';

import { Badge, Button } from '@saint-giong/bamboo-ui';
import { Crown, Sparkles } from 'lucide-react';

interface UpgradeHeroProps {
  isProcessing: boolean;
  onUpgrade: () => void;
}

export function UpgradeHero({ isProcessing, onUpgrade }: UpgradeHeroProps) {
  return (
    <div className="relative overflow-hidden border-b bg-gradient-to-b from-amber-50/80 via-orange-50/50 to-background px-6 py-16 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-background">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="-top-24 absolute right-0 h-96 w-96 rounded-full bg-gradient-to-br from-amber-200/30 to-orange-300/20 blur-3xl dark:from-amber-500/10 dark:to-orange-500/5" />
        <div className="-bottom-12 absolute left-0 h-64 w-64 rounded-full bg-gradient-to-tr from-orange-200/30 to-amber-300/20 blur-3xl dark:from-orange-500/10 dark:to-amber-500/5" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <Badge
          variant="outline"
          className="mb-6 border-amber-300 bg-amber-100/50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
        >
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          Upgrade to Premium
        </Badge>

        <h2 className="mb-4 font-serif text-4xl tracking-tight md:text-5xl">
          Find Your Perfect
          <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            Candidates Faster
          </span>
        </h2>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Unlock powerful AI-driven matching, real-time notifications, and
          custom search profiles to streamline your recruitment.
        </p>

        {/* Pricing */}
        <div className="mb-8 inline-flex items-baseline gap-1 rounded-2xl bg-background/80 px-6 py-3 shadow-lg backdrop-blur">
          <span className="font-semibold font-serif text-5xl tracking-tight">
            $29
          </span>
          <span className="text-muted-foreground">/month</span>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="min-w-[200px] gap-2 bg-gradient-to-r from-amber-500 to-orange-500 font-medium text-white shadow-lg shadow-orange-500/25 hover:from-amber-600 hover:to-orange-600"
            onClick={onUpgrade}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <Crown className="h-4 w-4" />
                Upgrade Now
              </>
            )}
          </Button>
          <p className="text-muted-foreground text-sm">
            Cancel anytime. No hidden fees.
          </p>
        </div>
      </div>
    </div>
  );
}
