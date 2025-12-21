'use client';

import { useEffect } from 'react';
import { notificationChannel } from '@/lib/realtime/notification-channel';
import { wsClient } from '@/lib/realtime/ws-client';
import { useNotificationStore } from '@/stores/notification-store';

/**
 * Component to initialize the WebSocket connection and set up event listeners.
 * This should be placed in an authenticated layout.
 */
export function RealtimeInitializer() {
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  // undo this comment to test connection
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     addNotification({
  //       type: 'INFO',
  //       title: 'Test Notification',
  //       message: 'This is a test notification triggered manually.',
  //     });
  //   }, 5000);
  //   return () => clearTimeout(timer);
  // }, [addNotification]);

  useEffect(() => {
    // Initialize connection
    notificationChannel.initialize();

    // Set up notification listener
    const unsubscribeNotification = notificationChannel.onNotification(
      (data) => {
        console.log('[Realtime] New notification received:', data);
        addNotification({
          type: data.type || 'INFO',
          title: data.title || 'New Notification',
          message: data.message || '',
          metadata: data.metadata,
        });
      }
    );

    // Set up matching applicant listener (Premium feature)
    const unsubscribeMatching = notificationChannel.onMatchingApplicant(
      (data) => {
        console.log('[Realtime] New matching applicant:', data);
        addNotification({
          type: 'MATCHING_APPLICANT',
          title: 'New Talent Match!',
          message: `A new applicant matching your criteria has appeared: ${data.name}`,
          metadata: data,
        });
      }
    );

    // Add test trigger for development
    if (process.env.NODE_ENV === 'development') {
      (window as any).testReceiveNotification = (data: any) => {
        console.log('[Test] Simulating received notification:', data);
        addNotification({
          type: data.type || 'INFO',
          title: data.title || 'Test Notification',
          message: data.message || 'This is a test notification.',
          metadata: data.metadata,
        });
      };
    }

    // Cleanup on unmount
    return () => {
      unsubscribeNotification();
      unsubscribeMatching();
      wsClient.disconnect();
      if (process.env.NODE_ENV === 'development') {
        delete (window as any).testReceiveNotification;
      }
    };
  }, [addNotification]);

  return null; // This component doesn't render anything
}
