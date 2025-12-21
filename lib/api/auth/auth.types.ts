/**
 * Authentication API Types
 */

// Registration
export interface RegisterRequest {
  companyName: string;
  email: string;
  password: string;
  country: string;
  phoneNumber: string | null;
  city: string | null;
  address?: string | null;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  companyId?: string;
  email?: string;
}

// Login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  isActivated: boolean;
  activated?: boolean;
  companyId?: string;
  accessToken?: string;
  refreshToken?: string;
}

// OTP Verification
export interface VerifyAccountRequest {
  otp: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
}

// Google OAuth
export interface GoogleRedirectResponse {
  success: boolean;
  message: string;
  data: string; // redirect URL
}

export interface GoogleRegisterRequest {
  companyName: string;
  email: string;
  country: string;
  phoneNumber: string | null;
  city: string | null;
  address?: string | null;
}

export interface GoogleRegisterResponse {
  success: boolean;
  message: string;
  data?: {
    companyId: string;
    companyName: string;
    email: string;
  };
}

// Google OAuth Callback Response (from /google/auth endpoint)
export interface GoogleCallbackPrefillData {
  email: string;
  name: string;
}

export interface GoogleCallbackResponse {
  success: boolean;
  message: string;
  data?: GoogleCallbackPrefillData | null; // null = existing user logged in
}

// Generic response wrapper
export interface GenericResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
