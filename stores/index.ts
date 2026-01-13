export type { AuthState } from './auth';
export { useAuthStore } from './auth';
export type { Notification, NotificationState } from './notification-store';
export { useNotificationStore } from './notification-store';
export type { ProfileState } from './profile';
export { useProfileStore } from './profile';
export type { SubscriptionState } from './subscription';
export { useSubscriptionStore } from './subscription';

/**
 * Storage keys used by Zustand persist middleware.
 * These need to be cleared when user visits auth pages to ensure clean state.
 */
export const AUTH_STORAGE_KEYS = [
  'auth-storage',
  'subscription-storage',
  'notification-storage',
] as const;

/**
 * Clear all auth-related localStorage entries.
 * Should be called when user visits login/signup pages to invalidate cached state.
 */
export function clearAuthStorage(): void {
  if (typeof window === 'undefined') return;

  for (const key of AUTH_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
}
