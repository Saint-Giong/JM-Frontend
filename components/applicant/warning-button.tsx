'use client';

import { Button } from '@saint-giong/bamboo-ui';
import { AlertTriangle } from 'lucide-react';

interface WarningButtonProps {
  hasWarning: boolean;
  onClick: () => void;
  size?: 'sm' | 'default' | 'icon';
  showLabel?: boolean;
  className?: string;
}

export function WarningButton({
  hasWarning,
  onClick,
  size = 'sm',
  showLabel = false,
  className,
}: WarningButtonProps) {
  return (
    <Button size={size} variant="ghost" onClick={onClick} className={className}>
      <AlertTriangle
        className={`h-4 w-4 ${showLabel ? 'mr-1' : ''} ${
          hasWarning ? 'fill-current text-orange-500' : ''
        }`}
      />
      {showLabel && (hasWarning ? 'Remove warning' : 'Add warning')}
    </Button>
  );
}
