'use client';

import type { Notification } from '@/lib/api/notifications';
import { Card, CardContent } from '@saint-giong/bamboo-ui';
import { BellOff, Loader2 } from 'lucide-react';
import { NotificationItem } from './notification-item';
import { useInfiniteScroll } from './use-infinite-scroll';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
}

export function NotificationList({
  notifications,
  onMarkAsRead,
  onDelete,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore = () => {},
}: NotificationListProps) {
  const { observerTarget } = useInfiniteScroll({
    onLoadMore,
    hasMore,
    isLoading: isLoadingMore,
    threshold: 300,
  });

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BellOff className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="font-semibold text-lg">No notifications</h3>
            <p className="text-muted-foreground text-sm">
              You&apos;re all caught up! Check back later for updates.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onDelete={onDelete}
            />
          ))}
        </div>

        {hasMore && ( // infinite scroll
          <div
            ref={observerTarget}
            className="flex items-center justify-center border-t py-4"
          >
            {isLoadingMore && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading more...</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
