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

export interface AuthState {
  // State
  user: Omit<MockUser, 'password'> | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (data: LoginFormData) => Promise<LoginResponse>;
  loginWithGoogle: () => Promise<LoginResponse>;
  signup: (data: SignupFormData) => Promise<SignupResponse>;
  signupWithGoogle: () => Promise<SignupResponse>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  isLoading: false,
  error: null,

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

  logout: () => {
    set({ user: null, isLoading: false, error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
