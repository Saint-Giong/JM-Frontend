'use client';

import { useNotificationStore } from '@/stores';
import type { Notification as NotificationFromMock } from '@/mocks/notifications';
import { useCallback, useState, useMemo } from 'react';
import type { NotificationPreferences } from './types';

const defaultPreferences: NotificationPreferences = {
  emailNotifications: true,
  applicationAlerts: true,
  matchAlerts: true,
  weeklyDigest: false,
  systemNotifications: true,
};

const ITEMS_PER_PAGE = 10; // load per chunk

// Convert between store notification format and mock format
function convertStoreToMock(storeNotif: any): NotificationFromMock {
  return {
    id: storeNotif.id,
    type: storeNotif.metadata?.type || 'system',
    title: storeNotif.title,
    message: storeNotif.message,
    timestamp: new Date(storeNotif.timestamp).toLocaleString(),
    read: storeNotif.isRead,
    applicantName: storeNotif.metadata?.applicantName,
    jobTitle: storeNotif.metadata?.jobTitle,
  };
}

export function useNotifications() {
  const {
    notifications: storeNotifications,
    unreadCount,
    markAsRead: storeMark,
    markAllAsRead: storeMarkAll,
    removeNotification: storeRemove,
    clearAll: storeClearAll,
    addNotification: storeAdd,
  } = useNotificationStore();

  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(defaultPreferences);
  
  // Pagination state
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Convert store notifications to mock format
  const allNotifications = useMemo(
    () => storeNotifications.map(convertStoreToMock),
    [storeNotifications]
  );

  // Get paginated notifications
  const notifications = useMemo(
    () => allNotifications.slice(0, displayedCount),
    [allNotifications, displayedCount]
  );

  const hasMore = displayedCount < allNotifications.length;

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    // Simulate network delay for smooth UX
    setTimeout(() => {
      setDisplayedCount((prev) => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, hasMore, displayedCount, allNotifications.length]);

  const handleMarkAsRead = useCallback(
    (id: string) => {
      storeMark(id);
    },
    [storeMark]
  );

  const handleMarkAllAsRead = useCallback(() => {
    storeMarkAll();
  }, [storeMarkAll]);

  const handleDelete = useCallback(
    (id: string) => {
      storeRemove(id);
    },
    [storeRemove]
  );

  const handleClearAll = useCallback(() => {
    storeClearAll();
    setDisplayedCount(ITEMS_PER_PAGE); // Reset pagination
  }, [storeClearAll]);

  const updatePreference = useCallback(
    <K extends keyof NotificationPreferences>(
      key: K,
      value: NotificationPreferences[K]
    ) => {
      setPreferences((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSavePreferences = useCallback(async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
  }, []);

  const addNotification = useCallback(
    (notification: Omit<NotificationFromMock, 'id' | 'timestamp' | 'read'>) => {
      storeAdd({
        type: notification.type.toUpperCase() as any,
        title: notification.title,
        message: notification.message,
        metadata: {
          type: notification.type,
          applicantName: notification.applicantName,
          jobTitle: notification.jobTitle,
        },
      });
    },
    [storeAdd]
  );

  return {
    notifications,
    unreadCount,
    preferences,
    isSaving,
    hasMore,
    isLoadingMore,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
    handleClearAll,
    updatePreference,
    handleSavePreferences,
    addNotification,
    handleLoadMore,
  };
}
