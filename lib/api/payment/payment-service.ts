/**
 * Payment API Service
 *
 * Provides API methods for interacting with the Company Payment service.
 * Supports CRUD operations for payment transactions with Stripe integration.
 */

import { buildEndpoint } from '@/lib/api/config';
import { HttpError } from '@/lib/http';
import { fetchWithAuth } from '../fetch-with-auth';
import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  CreateStripeCheckoutRequest,
  PaymentDetails,
  PaymentResponse,
  StripeCheckoutResponse,
  UpdatePaymentRequest,
} from './types';

const PAYMENT_ENDPOINT = 'payment';

/**
 * Create a new payment transaction.
 * Endpoint: POST /v1/payment/
 */
export async function createPayment(
  data: CreatePaymentRequest
): Promise<CreatePaymentResponse> {
  const url = buildEndpoint(`${PAYMENT_ENDPOINT}/`);

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

  const result: PaymentResponse<CreatePaymentResponse> = await response.json();
  return result.data ?? (result as unknown as CreatePaymentResponse);
}

/**
 * Get a payment transaction by ID.
 * Endpoint: GET /v1/payment/:id
 */
export async function getPayment(id: string): Promise<PaymentDetails> {
  const url = buildEndpoint(`${PAYMENT_ENDPOINT}/${id}`);

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

  const result: PaymentResponse = await response.json();
  return result.data ?? (result as unknown as PaymentDetails);
}

/**
 * List all payment transactions.
 * Endpoint: GET /v1/payment/
 */
export async function listPayments(): Promise<PaymentDetails[]> {
  const url = buildEndpoint(`${PAYMENT_ENDPOINT}/`);

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
 * Update a payment transaction.
 * Endpoint: PATCH /v1/payment/:id
 */
export async function updatePayment(
  id: string,
  data: UpdatePaymentRequest
): Promise<PaymentDetails> {
  const url = buildEndpoint(`${PAYMENT_ENDPOINT}/${id}`);

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

  const result: PaymentResponse = await response.json();
  return result.data ?? (result as unknown as PaymentDetails);
}

/**
 * Delete a payment transaction.
 * Endpoint: DELETE /v1/payment/:id
 */
export async function deletePayment(id: string): Promise<{ success: boolean }> {
  const url = buildEndpoint(`${PAYMENT_ENDPOINT}/${id}`);

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

  return { success: true };
}

/**
 * Create a Stripe checkout session.
 * Endpoint: POST /v1/payment/stripe/checkout-session
 */
export async function createStripeCheckoutSession(
  data: CreateStripeCheckoutRequest
): Promise<StripeCheckoutResponse> {
  const url = buildEndpoint(`${PAYMENT_ENDPOINT}/stripe/checkout-session`);

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
 * Redirect to Stripe checkout.
 * This is a client-side helper to handle the checkout flow.
 */
export function redirectToCheckout(checkoutUrl: string): void {
  if (typeof window !== 'undefined' && checkoutUrl) {
    window.location.href = checkoutUrl;
  }
}

/**
 * Payment API object with all methods
 */
export const paymentApi = {
  create: createPayment,
  get: getPayment,
  list: listPayments,
  update: updatePayment,
  delete: deletePayment,
  createStripeCheckout: createStripeCheckoutSession,
  redirectToCheckout,
} as const;

// Legacy export for backwards compatibility
export const paymentService = paymentApi;
