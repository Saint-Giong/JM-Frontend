'use client';

import { Button, Card, CardContent } from '@saint-giong/bamboo-ui';
import { Crown } from 'lucide-react';
import { formatDate, getDateFromNow } from '@/lib';

interface PremiumStatusCardProps {
  renewalDate?: Date;
  onManageBilling?: () => void;
}

export function PremiumStatusCard({
  renewalDate = getDateFromNow(1),
  onManageBilling,
}: PremiumStatusCardProps) {
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/30 shadow-xl">
              <Crown className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Premium Plan Active</h3>
              <p className="text-muted-foreground text-sm">
                Your subscription renews on {formatDate(renewalDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onManageBilling}
              disabled={!onManageBilling}
            >
              Manage Billing
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
