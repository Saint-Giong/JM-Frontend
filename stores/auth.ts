'use client';

import type { SignupFormData } from '@/app/(auth)/signup/api/schema';
import { authApi, profileApi } from '@/lib/api';
import type { LoginRequest } from '@/lib/api/auth';
import type { CompanyProfile } from '@/lib/api/profile';
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
  userEmail: string | null;
  companyProfile: CompanyProfile | null;
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
  fetchCompanyProfile: () => Promise<CompanyProfile | null>;
  logout: () => void;
  clearError: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      isActivated: false,
      companyId: null,
      userEmail: null,
      companyProfile: null,
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
            userEmail: data.email,
            isLoading: false,
          });

          // Fetch company profile if login successful and we have companyId
          if (result.success && result.companyId) {
            // Don't await - let it load in background
            get().fetchCompanyProfile();
          }

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

      fetchCompanyProfile: async () => {
        const { companyId } = get();
        if (!companyId) {
          return null;
        }

        try {
          const profile = await profileApi.get(companyId);
          set({ companyProfile: profile });
          return profile;
        } catch (err) {
          console.error('Failed to fetch company profile:', err);
          return null;
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          isActivated: false,
          companyId: null,
          userEmail: null,
          companyProfile: null,
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
      // Only persist auth status flags, companyId, email and profile, not loading/error state
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isActivated: state.isActivated,
        companyId: state.companyId,
        userEmail: state.userEmail,
        companyProfile: state.companyProfile,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
