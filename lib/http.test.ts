import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpClient, HttpError, createHttpClient, http } from './http';

const mockFetch = vi.fn();
global.fetch = mockFetch;

function createMockResponse(
  data: unknown,
  options: { status?: number; statusText?: string; contentType?: string } = {}
) {
  const {
    status = 200,
    statusText = 'OK',
    contentType = 'application/json',
  } = options;
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    headers: new Headers({ 'content-type': contentType }),
    json: vi.fn().mockResolvedValue(data),
    text: vi
      .fn()
      .mockResolvedValue(
        typeof data === 'string' ? data : JSON.stringify(data)
      ),
  };
}

describe('HttpError', () => {
  it('should create an error with status and statusText', () => {
    const error = new HttpError(404, 'Not Found');
    expect(error.status).toBe(404);
    expect(error.statusText).toBe('Not Found');
    expect(error.message).toBe('HTTP Error 404: Not Found');
    expect(error.name).toBe('HttpError');
  });

  it('should include data if provided', () => {
    const errorData = { message: 'Resource not found' };
    const error = new HttpError(404, 'Not Found', errorData);
    expect(error.data).toEqual(errorData);
  });
});

describe('HttpClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('constructor', () => {
    it('should create instance with default options', () => {
      const client = new HttpClient();
      expect(client).toBeInstanceOf(HttpClient);
    });

    it('should create instance with custom options', () => {
      const client = new HttpClient({
        baseUrl: 'https://api.example.com',
        headers: { Authorization: 'Bearer token' },
        timeout: 5000,
      });
      expect(client).toBeInstanceOf(HttpClient);
    });
  });

  describe('GET requests', () => {
    it('should make a GET request', async () => {
      const responseData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValueOnce(createMockResponse(responseData));

      const client = new HttpClient({ baseUrl: 'https://api.example.com' });
      const response = await client.get<typeof responseData>('/users/1');

      expect(response.data).toEqual(responseData);
      expect(response.status).toBe(200);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users/1',
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should append query params to URL', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      const client = new HttpClient({ baseUrl: 'https://api.example.com' });
      await client.get('/users', {
        params: { page: 1, limit: 10, active: true },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=10'),
        expect.any(Object)
      );
    });

    it('should skip undefined params', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      const client = new HttpClient({ baseUrl: 'https://api.example.com' });
      await client.get('/users', { params: { page: 1, filter: undefined } });

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('page=1');
      expect(calledUrl).not.toContain('filter');
    });
  });

  describe('POST requests', () => {
    it('should make a POST request with body', async () => {
      const requestBody = { name: 'New User', email: 'user@example.com' };
      const responseData = { id: 1, ...requestBody };
      mockFetch.mockResolvedValueOnce(
        createMockResponse(responseData, { status: 201 })
      );

      const client = new HttpClient({ baseUrl: 'https://api.example.com' });
      const response = await client.post<
        typeof responseData,
        typeof requestBody
      >('/users', requestBody);

      expect(response.data).toEqual(responseData);
      expect(response.status).toBe(201);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestBody),
        })
      );
    });
  });

  describe('PUT requests', () => {
    it('should make a PUT request', async () => {
      const requestBody = { name: 'Updated User' };
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ id: 1, ...requestBody })
      );

      const client = new HttpClient({ baseUrl: 'https://api.example.com' });
      await client.put('/users/1', requestBody);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users/1',
        expect.objectContaining({ method: 'PUT' })
      );
    });
  });

  describe('PATCH requests', () => {
    it('should make a PATCH request', async () => {
      const requestBody = { name: 'Patched User' };
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ id: 1, ...requestBody })
      );

      const client = new HttpClient({ baseUrl: 'https://api.example.com' });
      await client.patch('/users/1', requestBody);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users/1',
        expect.objectContaining({ method: 'PATCH' })
      );
    });
  });

  describe('DELETE requests', () => {
    it('should make a DELETE request', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ success: true }));

      const client = new HttpClient({ baseUrl: 'https://api.example.com' });
      await client.delete('/users/1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users/1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('headers', () => {
    it('should merge default headers with request headers', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      const client = new HttpClient({
        baseUrl: 'https://api.example.com',
        headers: { Authorization: 'Bearer default-token' },
      });
      await client.get('/users', {
        headers: { 'X-Custom-Header': 'custom-value' },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer default-token',
            'X-Custom-Header': 'custom-value',
          }),
        })
      );
    });

    it('should set header dynamically', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      const client = new HttpClient({ baseUrl: 'https://api.example.com' });
      client.setHeader('Authorization', 'Bearer new-token');
      await client.get('/users');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer new-token',
          }),
        })
      );
    });

    it('should remove header', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      const client = new HttpClient({
        baseUrl: 'https://api.example.com',
        headers: { Authorization: 'Bearer token', 'X-Remove': 'value' },
      });
      client.removeHeader('X-Remove');
      await client.get('/users');

      const calledHeaders = mockFetch.mock.calls[0][1].headers;
      expect(calledHeaders).not.toHaveProperty('X-Remove');
    });
  });

  describe('error handling', () => {
    it('should throw HttpError on non-2xx response', async () => {
      const errorData = { message: 'Not found' };
      mockFetch.mockResolvedValueOnce(
        createMockResponse(errorData, { status: 404, statusText: 'Not Found' })
      );

      const client = new HttpClient({ baseUrl: 'https://api.example.com' });

      try {
        await client.get('/users/999');
        expect.fail('Should have thrown HttpError');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpError);
        expect((error as HttpError).status).toBe(404);
        expect((error as HttpError).statusText).toBe('Not Found');
      }
    });

    it('should handle timeout', async () => {
      vi.useRealTimers();

      mockFetch.mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            const error = new Error('Aborted');
            error.name = 'AbortError';
            reject(error);
          })
      );

      const client = new HttpClient({
        baseUrl: 'https://api.example.com',
        timeout: 50,
      });

      await expect(client.get('/slow-endpoint')).rejects.toThrow(
        'Request timeout'
      );
    });
  });

  describe('response parsing', () => {
    it('should parse JSON response', async () => {
      const data = { id: 1 };
      mockFetch.mockResolvedValueOnce(createMockResponse(data));

      const client = new HttpClient({ baseUrl: 'https://api.example.com' });
      const response = await client.get('/users/1');

      expect(response.data).toEqual(data);
    });

    it('should parse text response', async () => {
      const textData = 'Plain text response';
      mockFetch.mockResolvedValueOnce(
        createMockResponse(textData, { contentType: 'text/plain' })
      );

      const client = new HttpClient({ baseUrl: 'https://api.example.com' });
      const response = await client.get<string>('/text');

      expect(response.data).toBe(textData);
    });
  });
});

describe('createHttpClient', () => {
  it('should create a new HttpClient instance', () => {
    const client = createHttpClient({ baseUrl: 'https://api.example.com' });
    expect(client).toBeInstanceOf(HttpClient);
  });
});

describe('http (default instance)', () => {
  it('should be an HttpClient instance', () => {
    expect(http).toBeInstanceOf(HttpClient);
  });
});
