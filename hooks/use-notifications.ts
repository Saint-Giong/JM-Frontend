'use client';

import { useCallback, useMemo } from 'react';
import { markNotificationAsRead } from '@/lib/api/notifications';
import { notificationChannel } from '@/lib/realtime/notification-channel';
import { useNotificationStore } from '@/stores/notification-store';

/**
 * Headless hook that consumes the notificationStore.
 * Provides a clean API for components to access and manage notifications.
 */
export function useNotifications() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotificationStore();

  // Memoize filtered lists
  const readNotifications = useMemo(
    () => notifications.filter((n) => n.read),
    [notifications]
  );
  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.read),
    [notifications]
  );

  const handleMarkAsRead = useCallback(
    (id: string) => {
      markAsRead(id);
      // Emit WebSocket event for real-time sync
      notificationChannel.markAsRead(id);
      // Call REST API for server-side persistence
      markNotificationAsRead(id).catch((err) => {
        console.error('[Notifications] Failed to mark as read on server:', err);
      });
    },
    [markAsRead]
  );

  return {
    notifications,
    readNotifications,
    unreadNotifications,
    unreadCount,
    markAsRead: handleMarkAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };
}
