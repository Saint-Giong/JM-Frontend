import { http } from '../../http';
import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentDetails,
  UpdatePaymentRequest,
} from './types';

/**
 * Payment Service
 *
 * Provides API methods for interacting with the Company Payment service.
 * Supports CRUD operations for payment transactions with Stripe integration.
 */
export const paymentService = {
  /**
   * Create a new payment transaction.
   * Returns checkout URL for Stripe-based payments.
   *
   * @param data - Payment creation data
   * @returns Payment response with Stripe checkout URL
   */
  async createPayment(
    data: CreatePaymentRequest
  ): Promise<CreatePaymentResponse> {
    const response = await http.post<
      CreatePaymentResponse,
      CreatePaymentRequest
    >('/payments', data);
    return response.data;
  },

  /**
   * Get a payment transaction by ID.
   *
   * @param id - Payment transaction ID
   * @returns Payment details
   */
  async getPayment(id: string): Promise<PaymentDetails> {
    const response = await http.get<PaymentDetails>(`/payments/${id}`);
    return response.data;
  },

  /**
   * List all payment transactions.
   *
   * @returns Array of payment details
   */
  async listPayments(): Promise<PaymentDetails[]> {
    const response = await http.get<PaymentDetails[]>('/payments');
    return response.data;
  },

  /**
   * Update a payment transaction.
   *
   * @param id - Payment transaction ID
   * @param data - Partial update data
   * @returns Updated payment details
   */
  async updatePayment(
    id: string,
    data: UpdatePaymentRequest
  ): Promise<PaymentDetails> {
    const response = await http.patch<PaymentDetails, UpdatePaymentRequest>(
      `/payments/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a payment transaction.
   *
   * @param id - Payment transaction ID
   */
  async deletePayment(id: string): Promise<void> {
    await http.delete(`/payments/${id}`);
  },

  /**
   * Redirect to Stripe checkout.
   * This is a client-side helper to handle the checkout flow.
   *
   * @param checkoutUrl - The Stripe checkout URL from createPayment response
   */
  redirectToCheckout(checkoutUrl: string): void {
    if (typeof window !== 'undefined' && checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  },
};
