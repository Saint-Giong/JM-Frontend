'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SubscriptionState {
  // Whether the current company has an active premium subscription
  isPremium: boolean;
  // Stripe customer ID
  customerId: string | null;
  // Stripe subscription ID
  subscriptionId: string | null;

  // Actions
  setIsPremium: (isPremium: boolean) => void;
  setCustomerId: (customerId: string | null) => void;
  setSubscriptionId: (subscriptionId: string | null) => void;
  reset: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      isPremium: false,
      customerId: null,
      subscriptionId: null,

      setIsPremium: (isPremium) => set({ isPremium }),
      setCustomerId: (customerId) => set({ customerId }),
      setSubscriptionId: (subscriptionId) => set({ subscriptionId }),

      reset: () =>
        set({
          isPremium: false,
          customerId: null,
          subscriptionId: null,
        }),
    }),
    {
      name: 'subscription-storage',
    }
  )
);


