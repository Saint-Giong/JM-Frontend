import { HttpClient, HttpError } from './http';

type QueryParams = Record<string, string | number | boolean | undefined>;

interface QueryFnContext {
  signal?: AbortSignal;
  params?: QueryParams;
}

interface MutationContext<TBody> {
  body: TBody;
  params?: QueryParams;
}

// Base fetch function with error handling
async function baseFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
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
export function createApiClient(options: { baseUrl: string; getToken?: () => string | null | Promise<string | null> }) {
  const { baseUrl, getToken } = options;

  async function fetchWithAuth<T>(
    url: string,
    init?: RequestInit
  ): Promise<T> {
    const token = getToken ? await getToken() : null;

    const response = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
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
        return fetchWithAuth<T>(url, { signal: context?.signal });
      };
    },

    mutation<TResponse, TBody = unknown>(
      endpoint: string,
      method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
    ) {
      return (context: MutationContext<TBody>): Promise<TResponse> => {
        const url = buildUrl(endpoint, context.params, baseUrl);
        return fetchWithAuth<TResponse>(url, {
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
        return fetchWithAuth<TResponse>(url, { method: 'DELETE' });
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
