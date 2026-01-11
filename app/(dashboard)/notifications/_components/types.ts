export type {
  Notification,
  NotificationType,
} from '@/lib/api/notifications';

export interface NotificationPreferences {
  emailNotifications: boolean;
  applicationAlerts: boolean;
  matchAlerts: boolean;
  weeklyDigest: boolean;
  systemNotifications: boolean;
}
