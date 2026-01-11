import { buildEndpoint } from '@/lib/api';
import { HttpError } from '@/lib/http';
import { fetchWithAuth } from '../fetch-with-auth';
import type {
  Notification,
  NotificationResponse,
  PaginatedNotificationResponse,
} from './notifications.types';
import { transformNotification } from './notifications.types';

/**
 * Notification API Service
 *
 * Provides CRUD operations for notifications.
 * All endpoints are automatically prefixed with the configured base URL.
 * Gateway route: /v1/noti/** -> JM-NOTIFICATION-SERVICE
 */

const NOTIFICATION_ENDPOINT = 'noti';

/**
 * Get notifications for a company with pagination
 * Endpoint: GET /v1/noti/company/:companyId?page=X&size=Y
 */
export async function getNotificationsForCompany(
  companyId: string,
  page = 0,
  size = 10
): Promise<PaginatedNotificationResponse> {
  const url = buildEndpoint(
    `${NOTIFICATION_ENDPOINT}/company/${companyId}?page=${page}&size=${size}`
  );

  const response = await fetchWithAuth(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  return response.json();
}

/**
 * Get notifications for a company, transformed to frontend format
 * Convenience method that transforms backend response to UI-friendly format
 */
export async function getNotifications(
  companyId: string,
  page = 0,
  size = 10
): Promise<{
  notifications: Notification[];
  hasMore: boolean;
  totalElements: number;
}> {
  const result = await getNotificationsForCompany(companyId, page, size);

  return {
    notifications: result.content.map(transformNotification),
    hasMore: !result.last,
    totalElements: result.totalElements,
  };
}

/**
 * Get a notification by ID
 * Endpoint: GET /v1/noti/:id
 */
export async function getNotificationById(
  id: string
): Promise<NotificationResponse> {
  const url = buildEndpoint(`${NOTIFICATION_ENDPOINT}/${id}`);

  const response = await fetchWithAuth(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  return response.json();
}

/**
 * Mark a notification as read
 * Endpoint: PATCH /v1/noti/:id/read
 */
export async function markNotificationAsRead(
  id: string
): Promise<NotificationResponse> {
  const url = buildEndpoint(`${NOTIFICATION_ENDPOINT}/${id}/read`);

  const response = await fetchWithAuth(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  return response.json();
}

/**
 * Delete a notification
 * Endpoint: DELETE /v1/noti/:id
 */
export async function deleteNotification(id: string): Promise<void> {
  const url = buildEndpoint(`${NOTIFICATION_ENDPOINT}/${id}`);

  const response = await fetchWithAuth(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }
}

/**
 * Notification API object with all methods
 */
export const notificationApi = {
  getForCompany: getNotificationsForCompany,
  get: getNotifications,
  getById: getNotificationById,
  markAsRead: markNotificationAsRead,
  delete: deleteNotification,
} as const;
