export type { Notification, NotificationType } from '@/mocks/notifications';

export interface NotificationPreferences {
  emailNotifications: boolean;
  applicationAlerts: boolean;
  matchAlerts: boolean;
  weeklyDigest: boolean;
  systemNotifications: boolean;
}
