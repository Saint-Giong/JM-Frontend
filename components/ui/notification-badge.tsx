import { Badge, cn } from '@saint-giong/bamboo-ui';

interface NotificationBadgeProps {
  count: number;
  variant?: 'desktop' | 'mobile';
  className?: string;
}

/**
 * NotificationBadge - A reusable badge component for displaying notification counts
 * @param count - The number of unread notifications
 * @param variant - 'desktop' for sidebar (circular), 'mobile' for bottom nav (small corner badge)
 * @param className - Additional CSS classes to apply
 */
export function NotificationBadge({
  count,
  variant = 'desktop',
  className,
}: NotificationBadgeProps) {
  if (count <= 0) return null;

  const displayCount = count > 99 ? '99+' : count;

  if (variant === 'mobile') {
    return (
      <Badge
        variant="destructive"
        className={cn(
          'absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center px-1 font-semibold text-[10px]',
          className
        )}
      >
        {displayCount}
      </Badge>
    );
  }

  // Desktop variant - circular badge
  return (
    <Badge
      variant="destructive"
      className={cn(
        '!p-0 ml-auto flex h-6 w-6 items-center justify-center overflow-hidden rounded-full text-xs',
        className
      )}
    >
      <span style={{ transform: 'translateY(-0.75px)' }}>{displayCount}</span>
    </Badge>
  );
}
