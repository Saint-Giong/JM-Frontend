/**
 * Subscription API Service
 *
 * Provides operations for company subscription profiles.
 * All endpoints are automatically prefixed with the configured base URL.
 */

import { buildEndpoint } from '@/lib/api';
import { HttpError } from '@/lib/http';
import { fetchWithAuth } from '../fetch-with-auth';
import type {
  CreateSubscriptionProfileRequest,
  CreateSubscriptionProfileResponse,
  Subscription,
  SubscriptionStatusResponse,
  UpdateSubscriptionProfileRequest,
  UpdateSubscriptionProfileResponse,
} from './subscription.types';

const SUBSCRIPTION_ENDPOINT = 'subscription';

/**
 * Get all subscriptions
 * Endpoint: GET /v1/subscription/
 */
export async function getAllSubscriptions(): Promise<Subscription[]> {
  const url = buildEndpoint(`${SUBSCRIPTION_ENDPOINT}/`);

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

  const result = await response.json();
  return Array.isArray(result) ? result : (result.data ?? []);
}

/**
 * Get subscription status for a company
 * Endpoint: GET /v1/subscription/status/{companyId}
 */
export async function getSubscriptionStatus(
  companyId: string
): Promise<SubscriptionStatusResponse> {
  const url = buildEndpoint(`${SUBSCRIPTION_ENDPOINT}/status/${companyId}`);

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
 * Create a new subscription profile for a company
 * Endpoint: POST /v1/subscription/
 */
export async function createSubscriptionProfile(
  data: CreateSubscriptionProfileRequest
): Promise<CreateSubscriptionProfileResponse> {
  const url = buildEndpoint(`${SUBSCRIPTION_ENDPOINT}/`);

  const response = await fetchWithAuth(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  return response.json();
}

/**
 * Update a subscription profile
 * Endpoint: PATCH /v1/subscription/{id}
 */
export async function updateSubscriptionProfile(
  id: string,
  data: UpdateSubscriptionProfileRequest
): Promise<UpdateSubscriptionProfileResponse> {
  const url = buildEndpoint(`${SUBSCRIPTION_ENDPOINT}/${id}`);

  const response = await fetchWithAuth(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  return response.json();
}

/**
 * Subscription API object with all methods
 */
export const subscriptionApi = {
  getAll: getAllSubscriptions,
  getStatus: getSubscriptionStatus,
  create: createSubscriptionProfile,
  update: updateSubscriptionProfile,
} as const;
