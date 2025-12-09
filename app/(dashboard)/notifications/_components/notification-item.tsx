'use client';

import { Button } from '@saint-giong/bamboo-ui';
import { Bell, Check, Clock, Trash2, User, Users } from 'lucide-react';
import type { Notification, NotificationType } from './types';

// Map notification types to their corresponding icons
const iconMap: Record<
  NotificationType,
  React.ComponentType<{ className?: string }>
> = {
  application: User,
  match: Users,
  system: Bell,
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const Icon = iconMap[notification.type] || Bell;

  return (
    <div
      className={`flex gap-4 p-4 transition-colors hover:bg-muted/50 ${
        !notification.read ? 'bg-primary/5' : ''
      }`}
    >
      {/* Notification Type Icon */}
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
          !notification.read
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Notification Content */}
      <div className="min-w-0 flex-1">
        {/* Title and Unread Indicator */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}
            >
              {notification.title}
            </p>
            <p className="text-muted-foreground text-sm">
              {notification.applicantName && (
                <span className="font-medium text-foreground">
                  {notification.applicantName}{' '}
                </span>
              )}
              {notification.message}
            </p>
          </div>
          {/* Unread dot indicator */}
          {!notification.read && (
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
          )}
        </div>

        {/* Timestamp and Action Buttons */}
        <div className="mt-2 flex items-center gap-4">
          <span className="flex items-center gap-1 text-muted-foreground text-xs">
            <Clock className="h-3 w-3" />
            {notification.timestamp}
          </span>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Mark as Read - only shown for unread notifications */}
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto gap-1 px-2 py-1 text-primary text-xs"
                onClick={() => onMarkAsRead(notification.id)}
              >
                <Check className="h-3 w-3" />
                Mark as read
              </Button>
            )}

            {/* Delete Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-auto gap-1 px-2 py-1 text-muted-foreground text-xs hover:text-destructive"
              onClick={() => onDelete(notification.id)}
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
