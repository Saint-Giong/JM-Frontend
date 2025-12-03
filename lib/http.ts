type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestConfig<TBody = unknown> {
  headers?: HeadersInit;
  body?: TBody;
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  signal?: AbortSignal;
}

interface HttpResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(`HTTP Error ${status}: ${statusText}`);
    this.name = 'HttpError';
  }
}

export class HttpClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  private defaultTimeout: number;

  constructor(
    options: {
      baseUrl?: string;
      headers?: HeadersInit;
      timeout?: number;
    } = {}
  ) {
    this.baseUrl = options.baseUrl ?? '';
    this.defaultHeaders = options.headers ?? {};
    this.defaultTimeout = options.timeout ?? 30000;
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): string {
    const url = new URL(endpoint, this.baseUrl || undefined);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private async request<TResponse, TBody = unknown>(
    method: HttpMethod,
    endpoint: string,
    config: RequestConfig<TBody> = {}
  ): Promise<HttpResponse<TResponse>> {
    const { headers, body, params, timeout, signal } = config;

    const url = this.buildUrl(endpoint, params);

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      timeout ?? this.defaultTimeout
    );

    const mergedHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...this.defaultHeaders,
      ...headers,
    };

    const fetchOptions: RequestInit = {
      method,
      headers: mergedHeaders,
      signal: signal ?? controller.signal,
    };

    if (body !== undefined && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, fetchOptions);

      let data: TResponse;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as TResponse;
      }

      if (!response.ok) {
        throw new HttpError(response.status, response.statusText, data);
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async get<TResponse>(
    endpoint: string,
    config?: Omit<RequestConfig, 'body'>
  ): Promise<HttpResponse<TResponse>> {
    return this.request<TResponse>('GET', endpoint, config);
  }

  async post<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config?: Omit<RequestConfig<TBody>, 'body'>
  ): Promise<HttpResponse<TResponse>> {
    return this.request<TResponse, TBody>('POST', endpoint, {
      ...config,
      body,
    });
  }

  async put<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config?: Omit<RequestConfig<TBody>, 'body'>
  ): Promise<HttpResponse<TResponse>> {
    return this.request<TResponse, TBody>('PUT', endpoint, { ...config, body });
  }

  async patch<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config?: Omit<RequestConfig<TBody>, 'body'>
  ): Promise<HttpResponse<TResponse>> {
    return this.request<TResponse, TBody>('PATCH', endpoint, {
      ...config,
      body,
    });
  }

  async delete<TResponse>(
    endpoint: string,
    config?: Omit<RequestConfig, 'body'>
  ): Promise<HttpResponse<TResponse>> {
    return this.request<TResponse>('DELETE', endpoint, config);
  }

  setHeader(key: string, value: string): void {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      [key]: value,
    };
  }

  removeHeader(key: string): void {
    const headers = { ...this.defaultHeaders } as Record<string, string>;
    delete headers[key];
    this.defaultHeaders = headers;
  }
}

// Default instance for convenience
export const http = new HttpClient();

// Factory function to create configured instances
export function createHttpClient(options: {
  baseUrl?: string;
  headers?: HeadersInit;
  timeout?: number;
}): HttpClient {
  return new HttpClient(options);
}
