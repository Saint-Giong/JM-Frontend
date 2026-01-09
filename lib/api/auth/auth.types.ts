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
  tempToken?: string; // Fallback for cookie issues
}

export interface GoogleRegisterResponse {
  success: boolean;
  message: string;
  data?: {
    companyId: string;
    email: string;
    tokenPair?: {
      accessToken: string;
      accessTokenExpiresIn: number;
      refreshToken: string;
      refreshTokenExpiresIn: number;
    };
  };
}

// Google OAuth Callback Response (from /google/auth endpoint)
export interface GoogleCallbackPrefillData {
  email: string;
  name: string;
  tempToken?: string; // Fallback for cookie issues
}

// Response for existing user Google SSO login
export interface GoogleLoginData {
  companyId: string;
  email: string;
}

// The data can be prefill data (new user) or login data (existing user)
export type GoogleCallbackData = GoogleCallbackPrefillData | GoogleLoginData;

// Helper to check if data is for new user registration
export function isGooglePrefillData(
  data: GoogleCallbackData
): data is GoogleCallbackPrefillData {
  return 'name' in data;
}

// Helper to check if data is for existing user login
export function isGoogleLoginData(
  data: GoogleCallbackData
): data is GoogleLoginData {
  return 'companyId' in data;
}

export interface GoogleCallbackResponse {
  success: boolean;
  message: string;
  data?: GoogleCallbackData | null;
}

// Generic response wrapper
export interface GenericResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
