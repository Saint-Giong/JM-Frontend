'use client';

import { Bell, Check, Clock, Trash2, User, Users } from 'lucide-react';
import type { Notification, NotificationType } from './types';

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
      {/* Icon */}
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
          !notification.read
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
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
          {!notification.read && (
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
          )}
        </div>
        <div className="mt-2 flex items-center gap-4">
          <span className="flex items-center gap-1 text-muted-foreground text-xs">
            <Clock className="h-3 w-3" />
            {notification.timestamp}
          </span>
          <div className="flex items-center gap-2">
            {!notification.read && (
              <button
                type="button"
                onClick={() => onMarkAsRead(notification.id)}
                className="flex items-center gap-1 text-primary text-xs hover:underline"
              >
                <Check className="h-3 w-3" />
                Mark as read
              </button>
            )}
            <button
              type="button"
              onClick={() => onDelete(notification.id)}
              className="flex items-center gap-1 text-muted-foreground text-xs hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
