'use client';

import {
  type LoginResponse,
  login,
  loginWithGoogle,
} from '@/app/(auth)/login/api/login';
import type { LoginFormData } from '@/app/(auth)/login/api/schema';
import type { SignupFormData } from '@/app/(auth)/signup/api/schema';
import {
  type SignupResponse,
  signup,
  signupWithGoogle,
} from '@/app/(auth)/signup/api/signup';
import type { MockUser } from '@/mocks/users';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ProfileUpdateData = Partial<
  Pick<MockUser, 'companyName' | 'city' | 'address' | 'phoneNumber'>
>;

export interface AuthState {
  // State
  user: Omit<MockUser, 'password'> | null;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;

  // Actions
  login: (data: LoginFormData) => Promise<LoginResponse>;
  loginWithGoogle: () => Promise<LoginResponse>;
  signup: (data: SignupFormData) => Promise<SignupResponse>;
  signupWithGoogle: () => Promise<SignupResponse>;
  updateProfile: (data: ProfileUpdateData) => void;
  logout: () => void;
  clearError: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isLoading: false,
      error: null,
      hasHydrated: false,

      // Actions
      login: async (data) => {
        set({ error: null, isLoading: true });

        const result = await login(data);

        if (result.success && result.user) {
          set({ user: result.user, isLoading: false });
        } else if (result.error) {
          set({ error: result.error, isLoading: false });
        } else {
          set({ isLoading: false });
        }

        return result;
      },

      loginWithGoogle: async () => {
        set({ error: null, isLoading: true });

        const result = await loginWithGoogle();

        if (result.success && result.user) {
          set({ user: result.user, isLoading: false });
        } else if (result.error) {
          set({ error: result.error, isLoading: false });
        } else {
          set({ isLoading: false });
        }

        return result;
      },

      signup: async (data) => {
        set({ error: null, isLoading: true });

        const result = await signup(data);

        if (result.success && result.user) {
          set({ user: result.user, isLoading: false });
        } else if (result.error) {
          set({ error: result.error, isLoading: false });
        } else {
          set({ isLoading: false });
        }

        return result;
      },

      signupWithGoogle: async () => {
        set({ error: null, isLoading: true });

        const result = await signupWithGoogle();

        if (result.success && result.user) {
          set({ user: result.user, isLoading: false });
        } else if (result.error) {
          set({ error: result.error, isLoading: false });
        } else {
          set({ isLoading: false });
        }

        return result;
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },

      logout: () => {
        set({ user: null, isLoading: false, error: null });
      },

      clearError: () => {
        set({ error: null });
      },

      setHasHydrated: (hasHydrated) => {
        set({ hasHydrated });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
