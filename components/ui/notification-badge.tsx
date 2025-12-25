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
          'absolute -right-2 -top-2 h-4 min-w-4 px-1 text-[10px] font-semibold flex items-center justify-center',
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
        'ml-auto h-6 w-6 overflow-hidden rounded-full !p-0 text-xs flex items-center justify-center',
        className
      )}
    >
      <span style={{ transform: 'translateY(-0.75px)' }}>{displayCount}</span>
    </Badge>
  );
}
