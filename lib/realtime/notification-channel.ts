import type { Socket } from 'socket.io-client';
import { wsClient } from './ws-client';

/**
 * Topic and handler registry for notification-related events.
 * Decouples the WebSocket transport from the business logic.
 * Gracefully handles cases where WebSocket is unavailable.
 */
export class NotificationChannel {
  private socket: Socket | null = null;
  private companyId: string | undefined = undefined;

  /**
   * Initialize the channel with a socket instance.
   * @param companyId - Optional company ID for WebSocket authentication.
   * Returns false if WebSocket is unavailable.
   */
  initialize(companyId?: string): boolean {
    this.companyId = companyId;
    this.socket = wsClient.connect(companyId);
    return this.socket !== null;
  }

  /**
   * Check if the channel is connected.
   */
  isConnected(): boolean {
    return wsClient.isConnected();
  }

  /**
   * Subscribe to new notification events.
   * @param handler - Callback for notification data.
   * @param companyId - Optional company ID if not already initialized.
   * Returns a no-op unsubscribe if WebSocket is unavailable.
   */
  onNotification(
    handler: (data: Record<string, unknown>) => void,
    companyId?: string
  ): () => void {
    if (!this.socket) {
      this.initialize(companyId ?? this.companyId);
    }

    if (!this.socket) {
      // WebSocket unavailable, return no-op unsubscribe
      return () => {};
    }

    this.socket.on('notification', handler);

    // Return unsubscribe function
    return () => {
      this.socket?.off('notification', handler);
    };
  }

  /**
   * Subscribe to matching applicant events (Premium feature).
   * @param handler - Callback for matching applicant data.
   * @param companyId - Optional company ID if not already initialized.
   * Returns a no-op unsubscribe if WebSocket is unavailable.
   */
  onMatchingApplicant(
    handler: (data: Record<string, unknown>) => void,
    companyId?: string
  ): () => void {
    if (!this.socket) {
      this.initialize(companyId ?? this.companyId);
    }

    if (!this.socket) {
      // WebSocket unavailable, return no-op unsubscribe
      return () => {};
    }

    this.socket.on('matching_applicant', handler);

    return () => {
      this.socket?.off('matching_applicant', handler);
    };
  }

  /**
   * Emit an event to mark a notification as read.
   * No-op if WebSocket is unavailable.
   */
  markAsRead(notificationId: string): void {
    this.socket?.emit('notification:read', { id: notificationId });
  }
}

export const notificationChannel = new NotificationChannel();
