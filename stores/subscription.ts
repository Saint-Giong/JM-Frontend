'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SubscriptionState {
  // Whether the current company has an active premium subscription
  isPremium: boolean;

  // Actions
  setIsPremium: (isPremium: boolean) => void;
  reset: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      isPremium: false,

      setIsPremium: (isPremium) => set({ isPremium }),

      reset: () => set({ isPremium: false }),
    }),
    {
      name: 'subscription-storage',
    }
  )
);


