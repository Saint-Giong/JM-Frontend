import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpError } from './http';
import {
  createApiClient,
  createDeleteFn,
  createMutationFn,
  createPatchFn,
  createPostFn,
  createPutFn,
  createQueryFn,
} from './fetcher';

const mockFetch = vi.fn();
global.fetch = mockFetch;

function createMockResponse(
  data: unknown,
  options: { status?: number; statusText?: string } = {}
) {
  const { status = 200, statusText = 'OK' } = options;
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    json: vi.fn().mockResolvedValue(data),
  };
}

describe('createQueryFn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a query function', async () => {
    const data = [{ id: 1, name: 'User 1' }];
    mockFetch.mockResolvedValueOnce(createMockResponse(data));

    const queryFn = createQueryFn<typeof data>('https://api.example.com/users');
    const result = await queryFn();

    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/users',
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('should append query params', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse([]));

    const queryFn = createQueryFn('https://api.example.com/users');
    await queryFn({ params: { page: 1, limit: 10 } });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('page=1'),
      expect.any(Object)
    );
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('limit=10'),
      expect.any(Object)
    );
  });

  it('should use baseUrl if provided', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse([]));

    const queryFn = createQueryFn('/users', 'https://api.example.com');
    await queryFn();

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/users',
      expect.any(Object)
    );
  });

  it('should pass abort signal', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse([]));

    const controller = new AbortController();
    const queryFn = createQueryFn('https://api.example.com/users');
    await queryFn({ signal: controller.signal });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ signal: controller.signal })
    );
  });

  it('should throw HttpError on failure', async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse(
        { message: 'Not found' },
        { status: 404, statusText: 'Not Found' }
      )
    );

    const queryFn = createQueryFn('https://api.example.com/users/999');

    await expect(queryFn()).rejects.toThrow(HttpError);
  });
});

describe('createMutationFn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a POST mutation by default', async () => {
    const responseData = { id: 1, name: 'New User' };
    mockFetch.mockResolvedValueOnce(createMockResponse(responseData));

    const mutationFn = createMutationFn<typeof responseData, { name: string }>(
      'https://api.example.com/users'
    );
    const result = await mutationFn({ body: { name: 'New User' } });

    expect(result).toEqual(responseData);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/users',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'New User' }),
      })
    );
  });

  it('should support custom HTTP method', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({}));

    const mutationFn = createMutationFn(
      'https://api.example.com/users/1',
      'PUT'
    );
    await mutationFn({ body: { name: 'Updated' } });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'PUT' })
    );
  });

  it('should append query params to mutation URL', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({}));

    const mutationFn = createMutationFn('https://api.example.com/users');
    await mutationFn({ body: { name: 'User' }, params: { notify: true } });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('notify=true'),
      expect.any(Object)
    );
  });
});

describe('createPostFn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a POST mutation', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({ id: 1 }));

    const postFn = createPostFn('https://api.example.com/users');
    await postFn({ body: { name: 'User' } });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'POST' })
    );
  });
});

describe('createPutFn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a PUT mutation', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({ id: 1 }));

    const putFn = createPutFn('https://api.example.com/users/1');
    await putFn({ body: { name: 'Updated User' } });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'PUT' })
    );
  });
});

describe('createPatchFn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a PATCH mutation', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({ id: 1 }));

    const patchFn = createPatchFn('https://api.example.com/users/1');
    await patchFn({ body: { name: 'Patched User' } });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'PATCH' })
    );
  });
});

describe('createDeleteFn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a DELETE mutation', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({ success: true }));

    const deleteFn = createDeleteFn('https://api.example.com/users/1');
    await deleteFn();

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/users/1',
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('should support query params', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({ success: true }));

    const deleteFn = createDeleteFn('https://api.example.com/users/1');
    await deleteFn({ params: { soft: true } });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('soft=true'),
      expect.any(Object)
    );
  });
});

describe('createApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('query', () => {
    it('should create query function with baseUrl', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([{ id: 1 }]));

      const api = createApiClient({ baseUrl: 'https://api.example.com' });
      const result = await api.query('/users')();

      expect(result).toEqual([{ id: 1 }]);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.any(Object)
      );
    });

    it('should include auth token when getToken is provided', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      const api = createApiClient({
        baseUrl: 'https://api.example.com',
        getToken: () => 'my-token',
      });
      await api.query('/users')();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer my-token',
          }),
        })
      );
    });

    it('should support async getToken', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      const api = createApiClient({
        baseUrl: 'https://api.example.com',
        getToken: async () => 'async-token',
      });
      await api.query('/users')();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer async-token',
          }),
        })
      );
    });

    it('should not include auth header when token is null', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      const api = createApiClient({
        baseUrl: 'https://api.example.com',
        getToken: () => null,
      });
      await api.query('/users')();

      const calledHeaders = mockFetch.mock.calls[0][1].headers;
      expect(calledHeaders).not.toHaveProperty('Authorization');
    });
  });

  describe('post', () => {
    it('should create POST mutation', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ id: 1 }));

      const api = createApiClient({ baseUrl: 'https://api.example.com' });
      await api.post('/users')({ body: { name: 'User' } });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'User' }),
        })
      );
    });
  });

  describe('put', () => {
    it('should create PUT mutation', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ id: 1 }));

      const api = createApiClient({ baseUrl: 'https://api.example.com' });
      await api.put('/users/1')({ body: { name: 'Updated' } });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'PUT' })
      );
    });
  });

  describe('patch', () => {
    it('should create PATCH mutation', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ id: 1 }));

      const api = createApiClient({ baseUrl: 'https://api.example.com' });
      await api.patch('/users/1')({ body: { name: 'Patched' } });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'PATCH' })
      );
    });
  });

  describe('delete', () => {
    it('should create DELETE mutation', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ success: true }));

      const api = createApiClient({ baseUrl: 'https://api.example.com' });
      await api.delete('/users/1')();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users/1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('error handling', () => {
    it('should throw HttpError on failure', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse(
          { message: 'Unauthorized' },
          { status: 401, statusText: 'Unauthorized' }
        )
      );

      const api = createApiClient({ baseUrl: 'https://api.example.com' });

      await expect(api.query('/protected')()).rejects.toThrow(HttpError);
    });
  });
});
