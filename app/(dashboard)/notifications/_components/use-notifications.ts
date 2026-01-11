'use client';

import {
  deleteNotification,
  getNotifications,
  markNotificationAsRead,
  type Notification,
} from '@/lib/api/notifications';
import { useNotificationStore } from '@/stores';
import { useAuthStore } from '@/stores/auth';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { NotificationPreferences } from './types';

const defaultPreferences: NotificationPreferences = {
  emailNotifications: true,
  applicationAlerts: true,
  matchAlerts: true,
  weeklyDigest: false,
  systemNotifications: true,
};

const ITEMS_PER_PAGE = 10;

export function useNotifications() {
  const { companyId } = useAuthStore();
  const {
    notifications,
    unreadCount,
    hasMore,
    isLoading,
    currentPage,
    setNotifications,
    appendNotifications,
    markAsRead: storeMarkAsRead,
    markAllAsRead: storeMarkAllAsRead,
    removeNotification: storeRemoveNotification,
    clearAll: storeClearAll,
    addNotification: storeAddNotification,
    setLoading,
    setError,
    setPagination,
  } = useNotificationStore();

  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(defaultPreferences);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch notifications on mount
  useEffect(() => {
    if (!companyId || hasFetched) return;

    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getNotifications(companyId, 0, ITEMS_PER_PAGE);
        setNotifications(result.notifications);
        setPagination(0, result.hasMore, result.totalElements);
        setHasFetched(true);
      } catch (err) {
        console.error('[Notifications] Failed to fetch:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch notifications'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [
    companyId,
    hasFetched,
    setNotifications,
    setPagination,
    setLoading,
    setError,
  ]);

  // Load more notifications
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || !companyId) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const result = await getNotifications(
        companyId,
        nextPage,
        ITEMS_PER_PAGE
      );
      appendNotifications(result.notifications);
      setPagination(nextPage, result.hasMore, result.totalElements);
    } catch (err) {
      console.error('[Notifications] Failed to load more:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    isLoadingMore,
    hasMore,
    companyId,
    currentPage,
    appendNotifications,
    setPagination,
  ]);

  // Mark notification as read | no BE
  const handleMarkAsRead = useCallback(
    async (id: string) => {
      storeMarkAsRead(id);

      try {
        await markNotificationAsRead(id);
      } catch (err) {
        console.error('[Notifications] Failed to mark as read:', err);
      }
    },
    [storeMarkAsRead]
  );

  // Mark all as read | no BE
  const handleMarkAllAsRead = useCallback(() => {
    storeMarkAllAsRead();
  }, [storeMarkAllAsRead]);

  // Delete notification
  const handleDelete = useCallback(
    async (id: string) => {
      storeRemoveNotification(id);

      try {
        await deleteNotification(id);
      } catch (err) {
        console.error('[Notifications] Failed to delete:', err);
      }
    },
    [storeRemoveNotification]
  );

  // Clear all (local only)
  const handleClearAll = useCallback(() => {
    storeClearAll();
  }, [storeClearAll]);

  // Update preference
  const updatePreference = useCallback(
    <K extends keyof NotificationPreferences>(
      key: K,
      value: NotificationPreferences[K]
    ) => {
      setPreferences((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Save preferences | no BE
  const handleSavePreferences = useCallback(async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
  }, []);

  // Add notification (for WebSocket/local additions)
  const addNotification = useCallback(
    (
      notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'companyId'>
    ) => {
      storeAddNotification({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        read: false,
        companyId: companyId || '',
        ...notification,
      });
    },
    [storeAddNotification, companyId]
  );

  return {
    notifications,
    unreadCount,
    preferences,
    isSaving,
    hasMore,
    isLoading,
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
