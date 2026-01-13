import { getApiUrl } from './api/config';
import { buildProxyUrl } from './api/fetch-with-auth';
import { type HttpClient, HttpError } from './http';

type QueryParams = Record<string, string | number | boolean | undefined>;

interface QueryFnContext {
  signal?: AbortSignal;
  params?: QueryParams;
}

interface MutationContext<TBody> {
  body: TBody;
  params?: QueryParams;
}

/**
 * Check if URL should be proxied (is a backend URL)
 */
function shouldProxy(url: string): boolean {
  // If it starts with /api/proxy, it's already proxied
  if (url.startsWith('/api/proxy')) {
    return false;
  }

  // If it's a full URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Check if it's the backend URL
    const apiUrl = getApiUrl();
    return url.startsWith(apiUrl);
  }

  // It's a relative path, proxy it
  return true;
}

/**
 * Get the URL to use (proxy or direct)
 */
function getRequestUrl(url: string): string {
  if (shouldProxy(url)) {
    return buildProxyUrl(url);
  }
  return url;
}

// Base fetch function with error handling
async function baseFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const mergedHeaders = new Headers(options?.headers);
  if (!mergedHeaders.has('Content-Type')) {
    mergedHeaders.set('Content-Type', 'application/json');
  }

  // Route through proxy for authenticated requests
  const requestUrl = getRequestUrl(url);

  const response = await fetch(requestUrl, {
    ...options,
    headers: mergedHeaders,
    credentials: 'include', // Include cookies
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, data);
  }

  return response.json();
}

// Build URL with query params
function buildUrl(
  endpoint: string,
  params?: QueryParams,
  baseUrl?: string
): string {
  const url = baseUrl ? new URL(endpoint, baseUrl) : new URL(endpoint);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

// Query function factory for useQuery
export function createQueryFn<T>(endpoint: string, baseUrl?: string) {
  return async (context?: QueryFnContext): Promise<T> => {
    const url = buildUrl(endpoint, context?.params, baseUrl);
    return baseFetch<T>(url, { signal: context?.signal });
  };
}

// Mutation function factories for useMutation
export function createMutationFn<TResponse, TBody = unknown>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  baseUrl?: string
) {
  return async (context: MutationContext<TBody>): Promise<TResponse> => {
    const url = buildUrl(endpoint, context.params, baseUrl);
    return baseFetch<TResponse>(url, {
      method,
      body: JSON.stringify(context.body),
    });
  };
}

export function createPostFn<TResponse, TBody = unknown>(
  endpoint: string,
  baseUrl?: string
) {
  return createMutationFn<TResponse, TBody>(endpoint, 'POST', baseUrl);
}

export function createPutFn<TResponse, TBody = unknown>(
  endpoint: string,
  baseUrl?: string
) {
  return createMutationFn<TResponse, TBody>(endpoint, 'PUT', baseUrl);
}

export function createPatchFn<TResponse, TBody = unknown>(
  endpoint: string,
  baseUrl?: string
) {
  return createMutationFn<TResponse, TBody>(endpoint, 'PATCH', baseUrl);
}

export function createDeleteFn<TResponse>(endpoint: string, baseUrl?: string) {
  return async (context?: { params?: QueryParams }): Promise<TResponse> => {
    const url = buildUrl(endpoint, context?.params, baseUrl);
    return baseFetch<TResponse>(url, { method: 'DELETE' });
  };
}

// API client factory for React Query
export function createApiClient(options: {
  baseUrl: string;
  getToken?: () => string | null | Promise<string | null>;
}) {
  const { baseUrl } = options;

  async function fetchWithAuthInternal<T>(
    url: string,
    init?: RequestInit
  ): Promise<T> {
    // Route through proxy - no need to manually inject tokens
    const requestUrl = getRequestUrl(url);

    const response = await fetch(requestUrl, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new HttpError(response.status, response.statusText, data);
    }

    return response.json();
  }

  return {
    query<T>(endpoint: string) {
      return (context?: QueryFnContext): Promise<T> => {
        const url = buildUrl(endpoint, context?.params, baseUrl);
        return fetchWithAuthInternal<T>(url, { signal: context?.signal });
      };
    },

    mutation<TResponse, TBody = unknown>(
      endpoint: string,
      method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
    ) {
      return (context: MutationContext<TBody>): Promise<TResponse> => {
        const url = buildUrl(endpoint, context.params, baseUrl);
        return fetchWithAuthInternal<TResponse>(url, {
          method,
          body: JSON.stringify(context.body),
        });
      };
    },

    post<TResponse, TBody = unknown>(endpoint: string) {
      return this.mutation<TResponse, TBody>(endpoint, 'POST');
    },

    put<TResponse, TBody = unknown>(endpoint: string) {
      return this.mutation<TResponse, TBody>(endpoint, 'PUT');
    },

    patch<TResponse, TBody = unknown>(endpoint: string) {
      return this.mutation<TResponse, TBody>(endpoint, 'PATCH');
    },

    delete<TResponse>(endpoint: string) {
      return (context?: { params?: QueryParams }): Promise<TResponse> => {
        const url = buildUrl(endpoint, context?.params, baseUrl);
        return fetchWithAuthInternal<TResponse>(url, { method: 'DELETE' });
      };
    },
  };
}

// Create fetcher bound to HttpClient instance
export function createFetcher(client: HttpClient) {
  return <T>(endpoint: string) => {
    return async (context?: QueryFnContext): Promise<T> => {
      const { data } = await client.get<T>(endpoint, {
        params: context?.params,
        signal: context?.signal,
      });
      return data;
    };
  };
}
