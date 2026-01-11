import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchWithAuth } from './fetch-with-auth';

// Mock global fetch
const globalFetch = vi.fn();
global.fetch = globalFetch;

// Mock window and CustomEvent
const dispatchEvent = vi.fn();
global.window = {
  dispatchEvent,
  // api/fetch-with-auth.ts checks typeof window !== 'undefined'
} as any;

global.CustomEvent = class CustomEvent extends Event {
  detail: any;
  constructor(type: string, options?: any) {
    super(type);
    this.detail = options?.detail;
  }
} as any;

describe('fetchWithAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should dispatch auth:session-expired on network error', async () => {
    const error = new Error('Network error');
    globalFetch.mockRejectedValueOnce(error);

    await expect(fetchWithAuth('/test')).rejects.toThrow('Network error');

    expect(dispatchEvent).toHaveBeenCalledTimes(1);
    const event = dispatchEvent.mock.calls[0][0];
    expect(event.type).toBe('auth:session-expired');
  });

  it('should dispatch auth:session-expired on 500 error', async () => {
    globalFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    const response = await fetchWithAuth('/test');

    expect(response.status).toBe(500);
    expect(dispatchEvent).toHaveBeenCalledTimes(1);
    const event = dispatchEvent.mock.calls[0][0];
    expect(event.type).toBe('auth:session-expired');
  });

  it('should dispatch auth:session-expired on 503 error', async () => {
    globalFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({}),
    });

    const response = await fetchWithAuth('/test');

    expect(response.status).toBe(503);
    expect(dispatchEvent).toHaveBeenCalledTimes(1);
    const event = dispatchEvent.mock.calls[0][0];
    expect(event.type).toBe('auth:session-expired');
  });

  it('should NOT dispatch auth:session-expired on 404 error', async () => {
    globalFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({}),
    });

    const response = await fetchWithAuth('/test');

    expect(response.status).toBe(404);
    expect(dispatchEvent).not.toHaveBeenCalled();
  });
});
