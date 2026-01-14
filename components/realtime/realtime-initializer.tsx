'use client';

import { useEffect, useRef } from 'react';
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

  // Use refs to avoid stale closures in WebSocket callbacks
  const addNotificationRef = useRef(addNotification);
  const companyIdRef = useRef(companyId);

  // Keep refs up to date
  useEffect(() => {
    addNotificationRef.current = addNotification;
    companyIdRef.current = companyId;
  }, [addNotification, companyId]);

  // Initialize WebSocket connection and set up listeners
  // Re-runs when companyId changes (e.g., after login)
  useEffect(() => {
    // Skip if no companyId yet (wait for auth)
    if (!companyId) {
      return;
    }

    // Initialize connection with companyId for authentication
    notificationChannel.initialize(companyId);

    // Set up notification listener - use refs to always get latest values
    const unsubscribeNotification = notificationChannel.onNotification(
      (data) => {
        console.log('[Realtime] New notification received:', data);
        addNotificationRef.current(
          createNotificationFromWsData(
            data,
            companyIdRef.current || '',
            'system'
          )
        );
      }
    );

    // Set up matching applicant listener (Premium feature)
    const unsubscribeMatching = notificationChannel.onMatchingApplicant(
      (data) => {
        console.log('[Realtime] New matching applicant:', data);
        addNotificationRef.current(
          createNotificationFromWsData(
            {
              ...data,
              type: 'match',
              title: 'New Talent Match!',
              message: `A new applicant matching your criteria has appeared: ${data.name}`,
            },
            companyIdRef.current || '',
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
        addNotificationRef.current(
          createNotificationFromWsData(
            data,
            companyIdRef.current || '',
            'system'
          )
        );
      };
    }

    // Cleanup on unmount or when companyId changes
    return () => {
      unsubscribeNotification();
      unsubscribeMatching();
      wsClient.disconnect();
      if (process.env.NODE_ENV === 'development') {
        delete (window as unknown as Record<string, unknown>)
          .testReceiveNotification;
      }
    };
  }, [companyId]); // Re-run when companyId changes

  return null; // This component doesn't render anything
}
