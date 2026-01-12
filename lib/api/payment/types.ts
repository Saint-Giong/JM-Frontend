/**
 * Payment Types
 *
 * TypeScript types corresponding to the backend Payment service DTOs.
 */

/**
 * Payment method options
 */
export type PaymentMethod = 'VISA' | 'E_WALLET' | 'CREDIT_CARD';

/**
 * Transaction status options
 */
export type TransactionStatus =
  | 'SUCCESSFUL'
  | 'FAILED'
  | 'CANCELLED'
  | 'PENDING';

/**
 * Request DTO for creating a company payment
 */
export interface CreatePaymentRequest {
  companyId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
}

/**
 * Response DTO after creating a payment
 * Contains Stripe checkout information for redirecting the user
 */
export interface CreatePaymentResponse {
  id: string;
  status: TransactionStatus;
  /** Stripe Checkout Session id (cs_...). Present when using Stripe Checkout. */
  stripeCheckoutSessionId?: string;
  /** Stripe hosted Checkout URL to redirect the browser to. */
  checkoutUrl?: string;
}

/**
 * Response DTO for querying payment details
 */
export interface PaymentDetails {
  id: string;
  companyId: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  method: PaymentMethod;
  gateway?: string;
  paymentTransactionId?: string;
  stripePaymentIntentId?: string;
  stripeCheckoutSessionId?: string;
  subscriptionId?: string;
  purchasedAt?: string;
  createdAt?: string;
}

/**
 * Update payment request (partial update)
 */
export interface UpdatePaymentRequest {
  companyId?: string;
  amount?: number;
  currency?: string;
  method?: PaymentMethod;
}

/**
 * Request DTO for creating a Stripe checkout session
 */
export interface CreateStripeCheckoutRequest {
  amount: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
  description?: string;
  method?: PaymentMethod;
  metadata?: Record<string, string>;
}

/**
 * Response DTO for Stripe checkout session
 */
export interface StripeCheckoutResponse {
  success: boolean;
  message: string;
  data?: {
    checkoutSessionId: string;
    checkoutUrl: string;
  };
}

/**
 * Generic payment response wrapper
 */
export interface PaymentResponse<T = PaymentDetails> {
  success: boolean;
  message: string;
  data?: T;
}
