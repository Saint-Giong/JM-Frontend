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
  // Backend subscription profile ID
  subscriptionProfileId: string | null;
  // Hydration flag
  hasHydrated: boolean;

  // Actions
  setIsPremium: (isPremium: boolean) => void;
  setCustomerId: (customerId: string | null) => void;
  setSubscriptionId: (subscriptionId: string | null) => void;
  setSubscriptionProfileId: (subscriptionProfileId: string | null) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  reset: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      isPremium: false,
      customerId: null,
      subscriptionId: null,
      subscriptionProfileId: null,
      hasHydrated: false,

      setIsPremium: (isPremium) => set({ isPremium }),
      setCustomerId: (customerId) => set({ customerId }),
      setSubscriptionId: (subscriptionId) => set({ subscriptionId }),
      setSubscriptionProfileId: (subscriptionProfileId) =>
        set({ subscriptionProfileId }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),

      reset: () =>
        set({
          isPremium: false,
          customerId: null,
          subscriptionId: null,
          subscriptionProfileId: null,
        }),
    }),
    {
      name: 'subscription-storage',
      // Only persist data fields, not actions or hydration flag
      partialize: (state) => ({
        isPremium: state.isPremium,
        customerId: state.customerId,
        subscriptionId: state.subscriptionId,
        subscriptionProfileId: state.subscriptionProfileId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
