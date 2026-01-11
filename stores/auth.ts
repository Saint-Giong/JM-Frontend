'use client';

import type { SignupFormData } from '@/app/(auth)/signup/api/schema';
import { authApi, profileApi } from '@/lib/api';
import type { GoogleCallbackPrefillData, LoginRequest } from '@/lib/api/auth';
import { isGoogleLoginData, isGooglePrefillData } from '@/lib/api/auth';
import type { CompanyProfile } from '@/lib/api/profile';
import { HttpError } from '@/lib/http';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Backend error response structure
interface BackendErrorData {
  message?: string;
  errorFields?: Record<string, string>;
}

// Google callback result type
interface GoogleCallbackResult {
  success: boolean;
  needsRegistration?: boolean;
  prefill?: GoogleCallbackPrefillData;
  error?: string;
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
  handleGoogleCallback: (code: string) => Promise<GoogleCallbackResult>;
  signup: (data: SignupFormData) => Promise<{ success: boolean }>;
  verifyAccount: (otp: string) => Promise<{ success: boolean }>;
  resendOtp: () => Promise<{ success: boolean }>;
  fetchCompanyProfile: () => Promise<CompanyProfile | null>;
  logout: () => Promise<void>;
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

          const isActivated = result.activated ?? result.isActivated;

          set({
            isAuthenticated: result.success,
            isActivated: isActivated,
            companyId: result.companyId || null,
            userEmail: data.email,
            isLoading: false,
          });

          // Fetch company profile if login successful and we have companyId
          if (result.success && result.companyId) {
            // Don't await - let it load in background
            get().fetchCompanyProfile();
          }

          return { success: result.success, activated: isActivated };
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

      handleGoogleCallback: async (code: string) => {
        set({ error: null, fieldErrors: null, isLoading: true });

        try {
          const result = await authApi.handleGoogleCallback(code);

          if (result.data) {
            // Check if this is prefill data (new user) or login data (existing user)
            if (isGooglePrefillData(result.data)) {
              // New user - needs to complete registration
              set({ isLoading: false });
              return {
                success: true,
                needsRegistration: true,
                prefill: result.data,
              };
            }

            if (isGoogleLoginData(result.data)) {
              // Existing user - logged in via cookies, data contains companyId and email
              set({
                isAuthenticated: true,
                isActivated: true,
                companyId: result.data.companyId,
                userEmail: result.data.email,
                isLoading: false,
              });

              // Fetch company profile after successful login
              await get().fetchCompanyProfile();

              return { success: true, needsRegistration: false };
            }
          }

          // Fallback for legacy response without data (shouldn't happen with updated backend)
          set({ isAuthenticated: true, isActivated: true, isLoading: false });
          await get().fetchCompanyProfile();

          return { success: true, needsRegistration: false };
        } catch (err) {
          const errorData =
            err instanceof HttpError ? (err.data as BackendErrorData) : null;
          const message = errorData?.message || 'Google authentication failed';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
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
                : data.phoneNumber || null,
            city: data.city || null,
            address: data.address || null,
          });

          if (result.success) {
            // Automatically login after successful registration to get auth token
            // This is required for OTP verification which needs the auth_token cookie
            try {
              const loginResult = await authApi.login({
                email: data.email,
                password: data.password,
              });

              const isActivated =
                loginResult.activated ?? loginResult.isActivated;

              set({
                isAuthenticated: loginResult.success,
                isActivated: isActivated,
                companyId: loginResult.companyId || null,
                userEmail: data.email,
                isLoading: false,
              });

              return { success: result.success };
            } catch (loginErr) {
              // Login failed after registration, but registration was successful
              // User can still proceed to OTP but may need to login manually
              console.error('Auto-login after registration failed:', loginErr);
              set({ isLoading: false, userEmail: data.email });
              return { success: result.success };
            }
          }

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

          // If profile not found (404), it means the user/company might have been deleted
          // or the ID is invalid - we should log them out
          if (err instanceof HttpError && err.status === 404) {
            console.log('[AuthStore] Profile not found (404), logging out...');
            get().logout();
          }

          return null;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (err) {
          console.error('Failed to logout from server:', err);
        } finally {
          // Clear Zustand state
          set({
            isAuthenticated: false,
            isActivated: false,
            companyId: null,
            userEmail: null,
            companyProfile: null,
            error: null,
            fieldErrors: null,
          });

          // Explicitly clear persistent storage for auth-storage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-storage');
          }
        }
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
