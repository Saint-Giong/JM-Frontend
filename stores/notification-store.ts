import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification } from '@/lib/api/notifications';

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  totalElements: number;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  appendNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (page: number, hasMore: boolean, total: number) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      currentPage: 0,
      hasMore: true,
      totalElements: 0,

      setNotifications: (notifications) => {
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.read).length,
        });
      },

      appendNotifications: (newNotifications) => {
        set((state) => {
          // Filter out duplicates based on id
          const existingIds = new Set(state.notifications.map((n) => n.id));
          const uniqueNew = newNotifications.filter(
            (n) => !existingIds.has(n.id)
          );
          const updatedNotifications = [...state.notifications, ...uniqueNew];
          return {
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter((n) => !n.read).length,
          };
        });
      },

      addNotification: (notification) => {
        set((state) => {
          const updatedNotifications = [notification, ...state.notifications];
          return {
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter((n) => !n.read).length,
          };
        });
      },

      markAsRead: (id) => {
        set((state) => {
          const updatedNotifications = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          return {
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter((n) => !n.read).length,
          };
        });
      },

      markAllAsRead: () => {
        set((state) => {
          const updatedNotifications = state.notifications.map((n) => ({
            ...n,
            read: true,
          }));
          return {
            notifications: updatedNotifications,
            unreadCount: 0,
          };
        });
      },

      removeNotification: (id) => {
        set((state) => {
          const updatedNotifications = state.notifications.filter(
            (n) => n.id !== id
          );
          return {
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter((n) => !n.read).length,
          };
        });
      },

      clearAll: () => {
        set({
          notifications: [],
          unreadCount: 0,
          currentPage: 0,
          hasMore: true,
          totalElements: 0,
        });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error });
      },

      setPagination: (currentPage, hasMore, totalElements) => {
        set({ currentPage, hasMore, totalElements });
      },
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({
        // Only persist notifications, not loading/error states
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);

// Re-export Notification type for convenience
export type { Notification } from '@/lib/api/notifications';
