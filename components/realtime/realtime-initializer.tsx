'use client';

import { useEffect } from 'react';
import type { Notification, NotificationType } from '@/lib/api/notifications';
import { notificationChannel } from '@/lib/realtime/notification-channel';
import { wsClient } from '@/lib/realtime/ws-client';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification-store';

/**
 * Create a notification from WebSocket data
 */
function createNotificationFromWsData(
  data: Record<string, unknown>,
  companyId: string,
  defaultType: NotificationType = 'system'
): Notification {
  const type = (data.type as NotificationType) || defaultType;
  return {
    id: (data.id as string) || crypto.randomUUID(),
    type,
    title: (data.title as string) || 'New Notification',
    message: (data.message as string) || '',
    timestamp: (data.timestamp as string) || new Date().toISOString(),
    read: false,
    companyId,
  };
}

/**
 * Component to initialize the WebSocket connection and set up event listeners.
 * This should be placed in an authenticated layout.
 */
export function RealtimeInitializer() {
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );
  const { companyId } = useAuthStore();

  useEffect(() => {
    // Initialize connection
    notificationChannel.initialize();

    // Set up notification listener
    const unsubscribeNotification = notificationChannel.onNotification(
      (data) => {
        console.log('[Realtime] New notification received:', data);
        addNotification(
          createNotificationFromWsData(data, companyId || '', 'system')
        );
      }
    );

    // Set up matching applicant listener (Premium feature)
    const unsubscribeMatching = notificationChannel.onMatchingApplicant(
      (data) => {
        console.log('[Realtime] New matching applicant:', data);
        addNotification(
          createNotificationFromWsData(
            {
              ...data,
              type: 'match',
              title: 'New Talent Match!',
              message: `A new applicant matching your criteria has appeared: ${data.name}`,
            },
            companyId || '',
            'match'
          )
        );
      }
    );

    // Add test trigger for development
    if (process.env.NODE_ENV === 'development') {
      (window as unknown as Record<string, unknown>).testReceiveNotification = (
        data: Record<string, unknown>
      ) => {
        console.log('[Test] Simulating received notification:', data);
        addNotification(
          createNotificationFromWsData(data, companyId || '', 'system')
        );
      };
    }

    // Cleanup on unmount
    return () => {
      unsubscribeNotification();
      unsubscribeMatching();
      wsClient.disconnect();
      if (process.env.NODE_ENV === 'development') {
        delete (window as unknown as Record<string, unknown>)
          .testReceiveNotification;
      }
    };
  }, [addNotification, companyId]);

  return null; // This component doesn't render anything
}
