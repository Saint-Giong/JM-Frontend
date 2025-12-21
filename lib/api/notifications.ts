import type { Notification } from '@/stores/notification-store';
import { http } from '../http';

/**
 * Service for notification-related API calls.
 * Provides REST fallbacks for fetching and managing notifications.
 */
export const notificationService = {
  /**
   * Fetch the list of notifications from the server.
   */
  async getNotifications(): Promise<Notification[]> {
    const response = await http.get<Notification[]>('/notifications');
    return response.data;
  },

  /**
   * Mark a notification as read on the server.
   */
  async markAsRead(id: string): Promise<void> {
    await http.patch(`/notifications/${id}/read`);
  },

  /**
   * Mark all notifications as read on the server.
   */
  async markAllAsRead(): Promise<void> {
    await http.patch('/notifications/read-all');
  },

  /**
   * Delete a notification on the server.
   */
  async deleteNotification(id: string): Promise<void> {
    await http.delete(`/notifications/${id}`);
  },
};
