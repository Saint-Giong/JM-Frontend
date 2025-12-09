'use client';

import { mockNotifications, type Notification } from '@/mocks/notifications';
import { useCallback, useMemo, useState } from 'react';
import type { NotificationPreferences } from './types';

const defaultPreferences: NotificationPreferences = {
  emailNotifications: true,
  applicationAlerts: true,
  matchAlerts: true,
  weeklyDigest: false,
  systemNotifications: true,
};

export function useNotifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(defaultPreferences);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setNotifications([]);
  }, []);

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

  return {
    notifications,
    unreadCount,
    preferences,
    isSaving,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
    handleClearAll,
    updatePreference,
    handleSavePreferences,
  };
}
