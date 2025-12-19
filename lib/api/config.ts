/**
 * API Configuration
 *
 * This module provides centralized API configuration with swappable base URLs.
 * Set the NEXT_PUBLIC_API_BASE_URL environment variable to change the API endpoint.
 *
 * In development, requests are proxied through Next.js to avoid CORS issues.
 * The proxy is configured in next.config.ts.
 */

// Default API base URL - can be overridden via environment variable
const DEFAULT_API_BASE_URL = 'https://localhost:8072';

// API version prefix
const API_VERSION = 'v1';

/**
 * Check if we should use the proxy (client-side always uses proxy to avoid CORS)
 */
function shouldUseProxy(): boolean {
  // Always use proxy on client-side to avoid CORS issues
  return typeof window !== 'undefined';
}

/**
 * Get the configured API base URL.
 * On client-side, always uses the proxy to avoid CORS.
 * Priority: Proxy (client) > Environment variable > Default value
 */
export function getApiBaseUrl(): string {
  if (shouldUseProxy()) {
    // Use Next.js proxy on client-side to avoid CORS
    return '/api/proxy';
  }

  // Server-side - direct connection to backend
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

export { API_VERSION, DEFAULT_API_BASE_URL };
