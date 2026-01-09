/**
 * Subscription API Types
 *
 * TypeScript types matching backend DTOs for the Subscription Service.
 */

/**
 * Subscription status enum matching backend SubscriptionStatus
 */
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELED';

/**
 * Response from GET /v1/subscription/status/{companyId}
 */
export interface SubscriptionStatusResponse {
  status: SubscriptionStatus;
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
  id: string;
  companyId: string;
  status: SubscriptionStatus;
}

/**
 * Request body for PATCH /v1/subscription/{id}
 */
export interface UpdateSubscriptionProfileRequest {
  status: SubscriptionStatus;
  transactionId: string;
}

/**
 * Response from PATCH /v1/subscription/{id}
 */
export interface UpdateSubscriptionProfileResponse {
  id: string;
  companyId: string;
  status: SubscriptionStatus;
}
