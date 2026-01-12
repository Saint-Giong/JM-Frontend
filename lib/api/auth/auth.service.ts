import { buildEndpoint } from '@/lib/api';
import { HttpError } from '@/lib/http';
import type {
  ChangePasswordRequest,
  GoogleCallbackResponse,
  GoogleRedirectResponse,
  GoogleRegisterRequest,
  GoogleRegisterResponse,
  LinkGoogleResponse,
  LoginRequest,
  LoginResponse,
  OtpResponse,
  PasswordResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  SetPasswordRequest,
  VerifyAccountRequest,
} from './auth.types';

/**
 * Authentication API Service
 *
 * Provides authentication operations for company accounts.
 *
 * IMPORTANT: Core auth endpoints (login, register, verify, resend-otp, refresh-token)
 * are proxied through Next.js API routes to handle cross-site cookie restrictions.
 * Modern browsers block third-party cookies, so we proxy these requests through
 * the same origin to ensure cookies are properly stored and sent.
 */

const AUTH_ENDPOINT = 'auth';

/**
 * Register a new company account
 * Uses Next.js API proxy to handle cookies properly
 */
export async function register(
  data: RegisterRequest
): Promise<RegisterResponse> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
 * Uses Next.js API proxy to handle cookies properly
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
 * Uses Next.js API proxy to handle cookies properly
 */
export async function verifyAccount(
  data: VerifyAccountRequest
): Promise<OtpResponse> {
  const response = await fetch('/api/auth/verify-account', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
 * Uses Next.js API proxy to handle cookies properly
 */
export async function resendOtp(): Promise<OtpResponse> {
  const response = await fetch('/api/auth/resend-otp', {
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
 * Activate account via email token link
 * Endpoint: POST /v1/auth/activate-account
 */
export async function activateAccountByEmail(
  activationToken: string
): Promise<OtpResponse> {
  const url = buildEndpoint(
    `${AUTH_ENDPOINT}/activate-account?activationToken=${encodeURIComponent(activationToken)}`
  );

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  return response.json();
}

/**
 * Set initial password for SSO accounts
 * Requires ACCESS_TOKEN cookie
 * Endpoint: POST /v1/auth/set-password
 */
export async function setPassword(
  data: SetPasswordRequest
): Promise<PasswordResponse> {
  const url = buildEndpoint(`${AUTH_ENDPOINT}/set-password`);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  return response.json();
}

/**
 * Change password for existing account
 * Requires ACCESS_TOKEN cookie
 * Endpoint: POST /v1/auth/change-password
 */
export async function changePassword(
  data: ChangePasswordRequest
): Promise<PasswordResponse> {
  const url = buildEndpoint(`${AUTH_ENDPOINT}/change-password`);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  return response.json();
}

/**
 * Refresh access token using refresh token
 * Uses Next.js API proxy to handle cookies properly
 */
export async function refreshToken(): Promise<RefreshTokenResponse> {
  const response = await fetch('/api/auth/refresh-token', {
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
 * Link Google account to existing account
 * Requires ACCESS_TOKEN cookie
 * Endpoint: POST /v1/auth/google/link-google
 */
export async function linkGoogle(code: string): Promise<LinkGoogleResponse> {
  const url = buildEndpoint(
    `${AUTH_ENDPOINT}/google/link-google?code=${encodeURIComponent(code)}`
  );

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  return response.json();
}

/**
 * Re-link a new Google account (replace existing)
 * Requires ACCESS_TOKEN cookie
 * Endpoint: POST /v1/auth/google/relink-google
 */
export async function relinkGoogle(code: string): Promise<LinkGoogleResponse> {
  const url = buildEndpoint(
    `${AUTH_ENDPOINT}/google/relink-google?code=${encodeURIComponent(code)}`
  );

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
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
  // New methods
  activateAccountByEmail,
  setPassword,
  changePassword,
  refreshToken,
  linkGoogle,
  relinkGoogle,
} as const;
