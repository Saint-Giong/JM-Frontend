/**
 * API Configuration
 *
 * This module provides centralized API configuration with swappable base URLs.
 * Set the NEXT_PUBLIC_API_BASE_URL environment variable to change the API endpoint.
 */

// Whitelisted backend URLs
const BACKEND_URLS = {
  development: 'https://localhost:8072',
  production: 'https://sgjm-api.vohoangphuc.com',
} as const;

// Default API base URL - can be overridden via environment variable
const DEFAULT_API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? BACKEND_URLS.production
    : BACKEND_URLS.development;

// API version prefix
const API_VERSION = 'v1';

/**
 * Get the configured API base URL.
 * Priority: Environment variable > Default value (based on NODE_ENV)
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;
}

/**
 * Get the full API URL with version prefix
 */
export function getApiUrl(): string {
  return `${getApiBaseUrl()}/${API_VERSION}`;
}

/**
 * Build a full endpoint URL
 */
export function buildEndpoint(path: string): string {
  const base = getApiUrl();
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}/${cleanPath}`;
}

/**
 * API Configuration object for use with HttpClient
 */
export const apiConfig = {
  get baseUrl() {
    return getApiUrl();
  },
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

// Extend Window interface to allow runtime base URL override
declare global {
  interface Window {
    __API_BASE_URL__?: string;
  }
}

export { API_VERSION, BACKEND_URLS, DEFAULT_API_BASE_URL };
