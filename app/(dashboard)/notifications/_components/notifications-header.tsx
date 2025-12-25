'use client';

import { Badge, Button } from '@saint-giong/bamboo-ui';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';

interface NotificationsHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  hasNotifications: boolean;
}

export function NotificationsHeader({
  unreadCount,
  onMarkAllAsRead,
  onClearAll,
  hasNotifications,
}: NotificationsHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b px-6 py-4">
      <div className="flex items-center gap-4">
        <Bell className="h-6 w-6" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-2xl">Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full">
                {unreadCount}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            Stay updated with your recruitment activity
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onMarkAllAsRead}
          >
            <CheckCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Mark all read</span>
          </Button>
        )}
        {hasNotifications && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-destructive hover:text-destructive"
            onClick={onClearAll}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Clear all</span>
          </Button>
        )}
      </div>
    </header>
  );
}
