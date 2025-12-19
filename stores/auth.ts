'use client';

import type { SignupFormData } from '@/app/(auth)/signup/api/schema';
import { authApi } from '@/lib/api';
import type { LoginRequest } from '@/lib/api/auth';
import { HttpError } from '@/lib/http';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Backend error response structure
interface BackendErrorData {
  message?: string;
  errorFields?: Record<string, string>;
}

export interface AuthState {
  // State
  isAuthenticated: boolean;
  isActivated: boolean;
  companyId: string | null;
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string> | null;
  hasHydrated: boolean;

  // Actions
  login: (
    data: LoginRequest
  ) => Promise<{ success: boolean; activated?: boolean }>;
  loginWithGoogle: () => Promise<void>;
  signup: (data: SignupFormData) => Promise<{ success: boolean }>;
  verifyAccount: (otp: string) => Promise<{ success: boolean }>;
  resendOtp: () => Promise<{ success: boolean }>;
  logout: () => void;
  clearError: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      isActivated: false,
      companyId: null,
      isLoading: false,
      error: null,
      fieldErrors: null,
      hasHydrated: false,

      // Actions
      login: async (data) => {
        set({ error: null, fieldErrors: null, isLoading: true });

        try {
          const result = await authApi.login(data);

          set({
            isAuthenticated: result.success,
            isActivated: result.activated,
            companyId: result.companyId || null,
            isLoading: false,
          });

          return { success: result.success, activated: result.activated };
        } catch (err) {
          const errorData =
            err instanceof HttpError ? (err.data as BackendErrorData) : null;
          const message =
            errorData?.message ||
            (err instanceof Error ? err.message : 'Login failed');
          const fieldErrors = errorData?.errorFields || null;
          set({ error: message, fieldErrors, isLoading: false });
          return { success: false };
        }
      },

      loginWithGoogle: async () => {
        set({ error: null, fieldErrors: null, isLoading: true });

        try {
          const redirectUrl = await authApi.getGoogleRedirectUrl();
          window.location.href = redirectUrl;
        } catch (err) {
          const errorData =
            err instanceof HttpError ? (err.data as BackendErrorData) : null;
          const message =
            errorData?.message || 'Failed to get Google redirect URL';
          set({ error: message, isLoading: false });
        }
      },

      signup: async (data) => {
        set({ error: null, fieldErrors: null, isLoading: true });

        try {
          const result = await authApi.register({
            companyName: data.companyName,
            email: data.email,
            password: data.password,
            country: data.country,
            phoneNumber:
              data.dialCode && data.phoneNumber
                ? `${data.dialCode}${data.phoneNumber}`
                : data.phoneNumber || 'N/A',
            city: data.city || '',
            address: data.address || 'N/A',
          });

          set({ isLoading: false });
          return { success: result.success };
        } catch (err) {
          const errorData =
            err instanceof HttpError ? (err.data as BackendErrorData) : null;
          const message = errorData?.message || 'Signup failed';
          const fieldErrors = errorData?.errorFields || null;
          set({ error: message, fieldErrors, isLoading: false });
          return { success: false };
        }
      },

      verifyAccount: async (otp) => {
        set({ error: null, fieldErrors: null, isLoading: true });

        try {
          const result = await authApi.verifyAccount({ otp });
          set({ isActivated: result.success, isLoading: false });
          return { success: result.success };
        } catch (err) {
          const errorData =
            err instanceof HttpError ? (err.data as BackendErrorData) : null;
          const message = errorData?.message || 'Verification failed';
          const fieldErrors = errorData?.errorFields || null;
          set({ error: message, fieldErrors, isLoading: false });
          return { success: false };
        }
      },

      resendOtp: async () => {
        set({ error: null, fieldErrors: null, isLoading: true });

        try {
          const result = await authApi.resendOtp();
          set({ isLoading: false });
          return { success: result.success };
        } catch (err) {
          const errorData =
            err instanceof HttpError ? (err.data as BackendErrorData) : null;
          const message = errorData?.message || 'Failed to resend OTP';
          set({ error: message, isLoading: false });
          return { success: false };
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          isActivated: false,
          companyId: null,
          error: null,
          fieldErrors: null,
        });
      },

      clearError: () => {
        set({ error: null, fieldErrors: null });
      },

      setHasHydrated: (hasHydrated) => {
        set({ hasHydrated });
      },
    }),
    {
      name: 'auth-storage',
      // Only persist auth status flags and companyId, not loading/error state
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isActivated: state.isActivated,
        companyId: state.companyId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
