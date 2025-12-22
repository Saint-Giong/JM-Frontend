import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'MATCHING_APPLICANT';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  metadata?: Record<string, any>;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;

  // Actions
  addNotification: (
    notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  setNotifications: (notifications: Notification[]) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (data) => {
        const newNotification: Notification = {
          ...data,
          id: Math.random().toString(36).substring(2, 11),
          timestamp: new Date().toISOString(),
          isRead: false,
        };

        set((state) => {
          const updatedNotifications = [
            newNotification,
            ...state.notifications,
          ];
          return {
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter((n) => !n.isRead).length,
          };
        });
      },

      markAsRead: (id) => {
        set((state) => {
          const updatedNotifications = state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          );
          return {
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter((n) => !n.isRead).length,
          };
        });
      },

      markAllAsRead: () => {
        set((state) => {
          const updatedNotifications = state.notifications.map((n) => ({
            ...n,
            isRead: true,
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
            unreadCount: updatedNotifications.filter((n) => !n.isRead).length,
          };
        });
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      setNotifications: (notifications) => {
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.isRead).length,
        });
      },
    }),
    {
      name: 'notification-storage',
    }
  )
);
