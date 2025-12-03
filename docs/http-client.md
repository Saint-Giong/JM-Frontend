# HTTP Client & Fetcher Utilities

## What?

A type-safe HTTP client and fetcher utility library for making REST API requests in the frontend. The library consists of two main modules:

1. **HttpClient** (`lib/http.ts`) - A class-based HTTP client with full control over requests
2. **Fetcher Utilities** (`lib/fetcher.ts`) - Factory functions optimized for @tanstack/react-query

### Core Components

| Component | Type | Purpose |
|-----------|------|---------|
| `HttpClient` | Class | Full-featured HTTP client with configurable base URL, headers, and timeout |
| `HttpError` | Class | Custom error class with status, statusText, and response data |
| `http` | Instance | Default HttpClient instance for quick usage |
| `createHttpClient` | Factory | Creates configured HttpClient instances |
| `createQueryFn` | Factory | Creates query functions for `useQuery` |
| `createMutationFn` | Factory | Creates mutation functions for `useMutation` |
| `createApiClient` | Factory | Creates a full API client with authentication support |

## Why?

### Problems Solved

1. **Type Safety** - Full TypeScript support with generics for request/response types
2. **Consistency** - Standardized error handling and response parsing across the application
3. **DRY Principle** - Reusable configuration (base URL, headers, auth tokens)
4. **React Query Integration** - Purpose-built factories that work seamlessly with @tanstack/react-query
5. **Testability** - Clean separation of concerns makes mocking straightforward

### Design Decisions

| Decision | Rationale |
|----------|-----------|
| Class-based HttpClient | Allows stateful configuration (headers, base URL) while providing method chaining |
| Separate fetcher utilities | Optimized for React Query patterns without coupling to HttpClient |
| Factory functions | Enable creating pre-configured functions for specific endpoints |
| Custom HttpError | Preserves HTTP status information for proper error handling in UI |
| AbortController integration | Supports request cancellation and timeout handling |

## How?

### Installation

The library is built-in. Import from `@/lib`:

```typescript
import {
  HttpClient,
  HttpError,
  http,
  createHttpClient,
  createQueryFn,
  createApiClient
} from '@/lib';
```

### Basic Usage with HttpClient

```typescript
import { http, createHttpClient, HttpError } from '@/lib';

// Using default instance
const { data } = await http.get<User[]>('https://api.example.com/users');

// Creating configured instance
const api = createHttpClient({
  baseUrl: 'https://api.example.com',
  headers: { Authorization: 'Bearer token' },
  timeout: 10000,
});

// GET with query params
const { data: jobs } = await api.get<Job[]>('/jobs', {
  params: { status: 'published', limit: 10 },
});

// POST with body
const { data: newJob } = await api.post<Job, CreateJobDto>('/jobs', {
  title: 'Software Engineer',
  salary: 100000,
});

// Error handling
try {
  await api.delete('/jobs/123');
} catch (error) {
  if (error instanceof HttpError) {
    console.error(`Error ${error.status}: ${error.statusText}`);
    console.error('Response:', error.data);
  }
}
```

### Usage with React Query

#### Basic Query

```typescript
import { useQuery } from '@tanstack/react-query';
import { createQueryFn } from '@/lib';

interface User {
  id: number;
  name: string;
}

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: createQueryFn<User[]>('https://api.example.com/users'),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

#### Query with Parameters

```typescript
import { useQuery } from '@tanstack/react-query';
import { createQueryFn } from '@/lib';

function JobList({ status }: { status: string }) {
  const { data } = useQuery({
    queryKey: ['jobs', { status }],
    queryFn: () => createQueryFn<Job[]>('https://api.example.com/jobs')({
      params: { status },
    }),
  });

  return <div>{/* render jobs */}</div>;
}
```

#### Mutations

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPostFn, createDeleteFn } from '@/lib';

interface CreateJobDto {
  title: string;
  salary: number;
}

function CreateJobForm() {
  const queryClient = useQueryClient();

  const createJob = useMutation({
    mutationFn: createPostFn<Job, CreateJobDto>('https://api.example.com/jobs'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  const handleSubmit = (data: CreateJobDto) => {
    createJob.mutate({ body: data });
  };

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

### Using the API Client (Recommended)

The `createApiClient` factory provides a complete solution with authentication support:

```typescript
import { createApiClient } from '@/lib';

// Create API client with auth
const api = createApiClient({
  baseUrl: 'https://api.example.com',
  getToken: () => localStorage.getItem('accessToken'),
});

// Use in React Query
function useJobs(status?: string) {
  return useQuery({
    queryKey: ['jobs', { status }],
    queryFn: () => api.query<Job[]>('/jobs')({ params: { status } }),
  });
}

function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.post<Job, CreateJobDto>('/jobs'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

function useUpdateJob(id: string) {
  return useMutation({
    mutationFn: api.put<Job, UpdateJobDto>(`/jobs/${id}`),
  });
}

function useDeleteJob() {
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/jobs/${id}`)(),
  });
}
```

### Async Token Provider

For auth systems where token retrieval is async:

```typescript
const api = createApiClient({
  baseUrl: 'https://api.example.com',
  getToken: async () => {
    // Works with async token providers
    const session = await getSession();
    return session?.accessToken ?? null;
  },
});
```

### Error Handling in Components

```typescript
import { HttpError } from '@/lib';

function JobDetail({ id }: { id: string }) {
  const { data, error } = useQuery({
    queryKey: ['job', id],
    queryFn: api.query<Job>(`/jobs/${id}`),
  });

  if (error) {
    if (error instanceof HttpError) {
      if (error.status === 404) {
        return <NotFound message="Job not found" />;
      }
      if (error.status === 403) {
        return <Forbidden />;
      }
    }
    return <ErrorMessage error={error} />;
  }

  return <div>{/* render job */}</div>;
}
```

## API Reference

### HttpClient

```typescript
class HttpClient {
  constructor(options?: {
    baseUrl?: string;
    headers?: HeadersInit;
    timeout?: number; // default: 30000ms
  });

  get<T>(endpoint: string, config?: RequestConfig): Promise<HttpResponse<T>>;
  post<T, B>(endpoint: string, body?: B, config?: RequestConfig): Promise<HttpResponse<T>>;
  put<T, B>(endpoint: string, body?: B, config?: RequestConfig): Promise<HttpResponse<T>>;
  patch<T, B>(endpoint: string, body?: B, config?: RequestConfig): Promise<HttpResponse<T>>;
  delete<T>(endpoint: string, config?: RequestConfig): Promise<HttpResponse<T>>;

  setHeader(key: string, value: string): void;
  removeHeader(key: string): void;
}
```

### Fetcher Factories

```typescript
// Query function factory
createQueryFn<T>(endpoint: string, baseUrl?: string): QueryFn<T>;

// Mutation factories
createMutationFn<TResponse, TBody>(endpoint: string, method?: HttpMethod, baseUrl?: string): MutationFn;
createPostFn<TResponse, TBody>(endpoint: string, baseUrl?: string): MutationFn;
createPutFn<TResponse, TBody>(endpoint: string, baseUrl?: string): MutationFn;
createPatchFn<TResponse, TBody>(endpoint: string, baseUrl?: string): MutationFn;
createDeleteFn<TResponse>(endpoint: string, baseUrl?: string): DeleteFn;

// Full API client
createApiClient(options: {
  baseUrl: string;
  getToken?: () => string | null | Promise<string | null>;
}): ApiClient;
```

## Testing

Run tests:

```bash
bun run test        # Watch mode
bun run test:run    # Single run
bun run test:coverage  # With coverage
```

Tests are located in:
- `lib/http.test.ts` - HttpClient tests
- `lib/fetcher.test.ts` - Fetcher utilities tests
