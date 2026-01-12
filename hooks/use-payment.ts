'use client';

import { useCallback, useState } from 'react';
import {
  type CreatePaymentRequest,
  type CreatePaymentResponse,
  type PaymentDetails,
  paymentService,
} from '@/lib/api/payment';

interface UsePaymentState {
  isLoading: boolean;
  error: Error | null;
  payments: PaymentDetails[];
  currentPayment: PaymentDetails | null;
}

interface UsePaymentReturn extends UsePaymentState {
  /** Create a new payment and optionally redirect to Stripe checkout */
  createPayment: (
    data: CreatePaymentRequest,
    options?: { redirectToCheckout?: boolean }
  ) => Promise<CreatePaymentResponse | null>;
  /** Get a payment by ID */
  getPayment: (id: string) => Promise<PaymentDetails | null>;
  /** List all payments */
  listPayments: () => Promise<PaymentDetails[]>;
  /** Delete a payment */
  deletePayment: (id: string) => Promise<boolean>;
  /** Clear any errors */
  clearError: () => void;
}

/**
 * Hook for managing payment operations.
 * Provides a clean API for components to interact with the payment service.
 */
export function usePayment(): UsePaymentReturn {
  const [state, setState] = useState<UsePaymentState>({
    isLoading: false,
    error: null,
    payments: [],
    currentPayment: null,
  });

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({
      ...prev,
      isLoading,
      error: isLoading ? null : prev.error,
    }));
  }, []);

  const setError = useCallback((error: Error | null) => {
    setState((prev) => ({ ...prev, error, isLoading: false }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const createPayment = useCallback(
    async (
      data: CreatePaymentRequest,
      options?: { redirectToCheckout?: boolean }
    ): Promise<CreatePaymentResponse | null> => {
      setLoading(true);
      try {
        const response = await paymentService.create(data);

        // Optionally redirect to Stripe checkout
        if (options?.redirectToCheckout && response.checkoutUrl) {
          paymentService.redirectToCheckout(response.checkoutUrl);
        }

        setLoading(false);
        return response;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to create payment')
        );
        return null;
      }
    },
    [setLoading, setError]
  );

  const getPayment = useCallback(
    async (id: string): Promise<PaymentDetails | null> => {
      setLoading(true);
      try {
        const payment = await paymentService.get(id);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          currentPayment: payment,
        }));
        return payment;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to get payment')
        );
        return null;
      }
    },
    [setLoading, setError]
  );

  const listPayments = useCallback(async (): Promise<PaymentDetails[]> => {
    setLoading(true);
    try {
      const payments = await paymentService.list();
      setState((prev) => ({
        ...prev,
        isLoading: false,
        payments,
      }));
      return payments;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to list payments')
      );
      return [];
    }
  }, [setLoading, setError]);

  const deletePayment = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      try {
        await paymentService.delete(id);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          payments: prev.payments.filter((p) => p.id !== id),
          currentPayment:
            prev.currentPayment?.id === id ? null : prev.currentPayment,
        }));
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to delete payment')
        );
        return false;
      }
    },
    [setLoading, setError]
  );

  return {
    ...state,
    createPayment,
    getPayment,
    listPayments,
    deletePayment,
    clearError,
  };
}
