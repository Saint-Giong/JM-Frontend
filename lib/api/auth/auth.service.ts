import { buildEndpoint } from '@/lib/api';
import { HttpError } from '@/lib/http';
import type {
  GoogleCallbackResponse,
  GoogleRedirectResponse,
  GoogleRegisterRequest,
  GoogleRegisterResponse,
  LoginRequest,
  LoginResponse,
  OtpResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyAccountRequest,
} from './auth.types';

/**
 * Authentication API Service
 *
 * Provides authentication operations for company accounts.
 * All endpoints are automatically prefixed with the configured base URL.
 */

const AUTH_ENDPOINT = 'auth';

/**
 * Register a new company account
 */
export async function register(
  data: RegisterRequest
): Promise<RegisterResponse> {
  const url = buildEndpoint(`${AUTH_ENDPOINT}/register`);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Include cookies for consistency
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  return response.json();
}

/**
 * Login with email and password
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const url = buildEndpoint(`${AUTH_ENDPOINT}/login`);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Include cookies for auth_token
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  return response.json();
}

/**
 * Verify OTP and activate account
 * Requires auth_token cookie from login
 */
export async function verifyAccount(
  data: VerifyAccountRequest
): Promise<OtpResponse> {
  const url = buildEndpoint(`${AUTH_ENDPOINT}/verify-account`);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Include auth_token cookie
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  return response.json();
}

/**
 * Resend OTP to email
 * Requires auth_token cookie from login
 */
export async function resendOtp(): Promise<OtpResponse> {
  const url = buildEndpoint(`${AUTH_ENDPOINT}/resend-otp`);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Include auth_token cookie
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  return response.json();
}

/**
 * Get Google OAuth redirect URL
 */
export async function getGoogleRedirectUrl(): Promise<string> {
  const url = buildEndpoint(`${AUTH_ENDPOINT}/google/redirect-url`);

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  const result: GoogleRedirectResponse = await response.json();
  return result.data;
}

/**
 * Register with Google OAuth
 * Requires temp_token cookie from Google callback
 */
export async function googleRegister(
  data: GoogleRegisterRequest
): Promise<GoogleRegisterResponse> {
  const url = buildEndpoint(`${AUTH_ENDPOINT}/google/register`);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Include temp_token cookie
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  return response.json();
}

/**
 * Handle Google OAuth callback
 * Exchanges authorization code for authentication
 * Returns prefill data for new users or null for existing users (who get logged in via cookies)
 */
export async function handleGoogleCallback(
  code: string
): Promise<GoogleCallbackResponse> {
  const url = buildEndpoint(
    `${AUTH_ENDPOINT}/google/auth?code=${encodeURIComponent(code)}`
  );

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include', // Receive auth/temp cookies from backend
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  return response.json();
}

/**
 * Logout the currently authenticated company
 * Clears authentication cookies via Next.js API route
 */
export async function logout(): Promise<OtpResponse> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  return response.json();
}

/**
 * Auth API object with all methods
 */
export const authApi = {
  register,
  login,
  verifyAccount,
  resendOtp,
  getGoogleRedirectUrl,
  handleGoogleCallback,
  googleRegister,
  logout,
} as const;
