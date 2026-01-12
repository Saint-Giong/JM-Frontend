/**
 * Subscription API Types
 *
 * TypeScript types matching backend DTOs for the Subscription Service.
 */

/**
 * Subscription status enum matching backend SubscriptionStatus
 */
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

/**
 * Subscription entity from backend
 */
export interface Subscription {
  subscriptionId: string;
  status: SubscriptionStatus;
  expiryDate: string | null;
  companyId: string;
  transactionId: string | null;
}

/**
 * Response from GET /v1/subscription/status/{companyId}
 */
export interface SubscriptionStatusResponse {
  success: boolean;
  message: string;
  data?: {
    status: SubscriptionStatus;
    expiryDate?: string | null;
  };
}

/**
 * Request body for POST /v1/subscription/
 */
export interface CreateSubscriptionProfileRequest {
  companyId: string;
}

/**
 * Response from POST /v1/subscription/
 */
export interface CreateSubscriptionProfileResponse {
  success: boolean;
  message: string;
  data?: Subscription;
}

/**
 * Request body for PATCH /v1/subscription/{id}
 */
export interface UpdateSubscriptionProfileRequest {
  status?: SubscriptionStatus;
  transactionId?: string;
  expiryDate?: string;
}

/**
 * Response from PATCH /v1/subscription/{id}
 */
export interface UpdateSubscriptionProfileResponse {
  success: boolean;
  message: string;
  data?: Subscription;
}
