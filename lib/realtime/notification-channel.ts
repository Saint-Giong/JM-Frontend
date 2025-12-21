import type { Socket } from 'socket.io-client';
import { wsClient } from './ws-client';

/**
 * Topic and handler registry for notification-related events.
 * Decouples the WebSocket transport from the business logic.
 */
export class NotificationChannel {
  private socket: Socket | null = null;

  /**
   * Initialize the channel with a socket instance.
   */
  initialize(): void {
    this.socket = wsClient.connect();
  }

  /**
   * Subscribe to new notification events.
   */
  onNotification(handler: (data: any) => void): () => void {
    if (!this.socket) {
      this.initialize();
    }

    this.socket?.on('notification', handler);

    // Return unsubscribe function
    return () => {
      this.socket?.off('notification', handler);
    };
  }

  /**
   * Subscribe to matching applicant events (Premium feature).
   */
  onMatchingApplicant(handler: (data: any) => void): () => void {
    if (!this.socket) {
      this.initialize();
    }

    this.socket?.on('matching_applicant', handler);

    return () => {
      this.socket?.off('matching_applicant', handler);
    };
  }

  /**
   * Emit an event to mark a notification as read.
   */
  markAsRead(notificationId: string): void {
    this.socket?.emit('notification:read', { id: notificationId });
  }
}

export const notificationChannel = new NotificationChannel();
