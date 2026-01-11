/**
 * Notification API Types
 *
 * Types aligned with backend NotificationResponseDto
 */

/**
 * Notification response from backend API
 */
export interface NotificationResponse {
  notificationId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  companyId: string;
}

/**
 * Paginated response wrapper for notifications
 */
export interface PaginatedNotificationResponse {
  content: NotificationResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * Notification type for UI display purposes
 * Derived from notification content since backend doesn't have explicit types
 */
export type NotificationType = 'application' | 'match' | 'system';

/**
 * Frontend-friendly notification format
 * Used by UI components after transforming from backend response
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  companyId: string;
}

/**
 * Transform backend notification to frontend format
 */
export function transformNotification(
  response: NotificationResponse
): Notification {
  return {
    id: response.notificationId,
    type: deriveNotificationType(response.title, response.message),
    title: response.title,
    message: response.message,
    timestamp: response.createdAt,
    read: response.isRead,
    companyId: response.companyId,
  };
}

/**
 * Derive notification type from title/message content
 */
function deriveNotificationType(
  title: string,
  message: string
): NotificationType {
  const content = `${title} ${message}`.toLowerCase();

  if (
    content.includes('application') ||
    content.includes('applied') ||
    content.includes('applicant')
  ) {
    return 'application';
  }

  if (content.includes('match') || content.includes('matching')) {
    return 'match';
  }

  return 'system';
}
