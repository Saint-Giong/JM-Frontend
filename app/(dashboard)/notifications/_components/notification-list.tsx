'use client';

import { Button, Card, CardContent } from '@saint-giong/bamboo-ui';
import { BellOff } from 'lucide-react';
import { NotificationItem } from './notification-item';
import type { Notification } from './types';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationList({
  notifications,
  onMarkAsRead,
  onDelete,
  onClearAll,
}: NotificationListProps) {
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
    <>
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
        </CardContent>
      </Card>

      <div className="mt-4 text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          className="text-muted-foreground"
        >
          Clear all notifications
        </Button>
      </div>
    </>
  );
}
