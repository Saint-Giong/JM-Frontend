'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@saint-giong/bamboo-ui';
import { Clock, Play, Send } from 'lucide-react';
import { useState } from 'react';
import { buildEndpoint } from '@/lib/api';
import { JsonViewer } from '../_components';
import type { ApiEndpoint, ApiService } from '../_components/types';

const apiServices: ApiService[] = [
  {
    name: 'Auth',
    basePath: 'auth',
    endpoints: [
      {
        method: 'POST',
        path: '/register',
        description: 'Register company',
        hasBody: true,
      },
      { method: 'POST', path: '/login', description: 'Login', hasBody: true },
      {
        method: 'POST',
        path: '/verify-account',
        description: 'Verify OTP',
        hasBody: true,
      },
      { method: 'POST', path: '/resend-otp', description: 'Resend OTP' },
      {
        method: 'POST',
        path: '/refresh-token',
        description: 'Refresh access token',
      },
      {
        method: 'GET',
        path: '/google/redirect-url',
        description: 'Get Google OAuth URL',
      },
    ],
  },
  {
    name: 'Profile',
    basePath: 'profile',
    endpoints: [
      {
        method: 'GET',
        path: '/{id}',
        description: 'Get profile by ID',
        pathParams: ['id'],
      },
      { method: 'GET', path: '/profiles', description: 'Get all profiles' },
      {
        method: 'PATCH',
        path: '/{id}',
        description: 'Update profile',
        pathParams: ['id'],
        hasBody: true,
      },
    ],
  },
  {
    name: 'JobPost',
    basePath: 'jobpost',
    endpoints: [
      { method: 'GET', path: '/', description: 'Get all jobs' },
      {
        method: 'GET',
        path: '/{id}',
        description: 'Get job by ID',
        pathParams: ['id'],
      },
      {
        method: 'GET',
        path: '/search/{companyId}',
        description: 'Get jobs by company',
        pathParams: ['companyId'],
      },
      { method: 'POST', path: '/', description: 'Create job', hasBody: true },
      {
        method: 'PATCH',
        path: '/{id}',
        description: 'Update job',
        pathParams: ['id'],
        hasBody: true,
      },
      {
        method: 'DELETE',
        path: '/{id}',
        description: 'Delete job',
        pathParams: ['id'],
      },
    ],
  },
  {
    name: 'Discovery',
    basePath: 'discovery',
    endpoints: [
      {
        method: 'GET',
        path: '/applicants/all',
        description: 'Get all applicants',
      },
      {
        method: 'GET',
        path: '/applicants/{id}',
        description: 'Get applicant by ID',
        pathParams: ['id'],
      },
      {
        method: 'GET',
        path: '/applicants/search',
        description: 'Search applicants',
      },
      {
        method: 'POST',
        path: '/search-profile',
        description: 'Create search profile',
        hasBody: true,
      },
      {
        method: 'GET',
        path: '/search-profile/company/{companyId}',
        description: 'Get profiles by company',
        pathParams: ['companyId'],
      },
    ],
  },
  {
    name: 'Tag',
    basePath: 'tag',
    endpoints: [
      { method: 'GET', path: '/', description: 'Get all tags' },
      {
        method: 'GET',
        path: '/{id}',
        description: 'Get tag by ID',
        pathParams: ['id'],
      },
      {
        method: 'GET',
        path: '/search',
        description: 'Search tags (prefix param)',
      },
      {
        method: 'POST',
        path: '/create',
        description: 'Create tag',
        hasBody: true,
      },
      {
        method: 'PUT',
        path: '/{id}',
        description: 'Update tag',
        pathParams: ['id'],
        hasBody: true,
      },
      {
        method: 'DELETE',
        path: '/{id}',
        description: 'Delete tag',
        pathParams: ['id'],
      },
    ],
  },
  {
    name: 'Subscription',
    basePath: 'subscription',
    endpoints: [
      { method: 'GET', path: '/', description: 'Get all subscriptions' },
      {
        method: 'GET',
        path: '/status/{companyId}',
        description: 'Get subscription status',
        pathParams: ['companyId'],
      },
      {
        method: 'POST',
        path: '/',
        description: 'Create subscription',
        hasBody: true,
      },
      {
        method: 'PATCH',
        path: '/{id}',
        description: 'Update subscription',
        pathParams: ['id'],
        hasBody: true,
      },
    ],
  },
  {
    name: 'Payment',
    basePath: 'payment',
    endpoints: [
      { method: 'GET', path: '/', description: 'List all payments' },
      {
        method: 'GET',
        path: '/{id}',
        description: 'Get payment by ID',
        pathParams: ['id'],
      },
      {
        method: 'POST',
        path: '/',
        description: 'Create payment',
        hasBody: true,
      },
      {
        method: 'POST',
        path: '/stripe/checkout-session',
        description: 'Create Stripe checkout',
        hasBody: true,
      },
    ],
  },
  {
    name: 'Media',
    basePath: 'media',
    endpoints: [
      {
        method: 'GET',
        path: '/{id}',
        description: 'Get media by ID',
        pathParams: ['id'],
      },
      { method: 'GET', path: '/', description: 'List media (companyId param)' },
      {
        method: 'POST',
        path: '/',
        description: 'Create media record',
        hasBody: true,
      },
      {
        method: 'DELETE',
        path: '/{id}',
        description: 'Delete media',
        pathParams: ['id'],
      },
    ],
  },
  {
    name: 'Notification',
    basePath: 'noti',
    endpoints: [
      {
        method: 'GET',
        path: '/company/{companyId}',
        description: 'Get notifications by company',
        pathParams: ['companyId'],
      },
      {
        method: 'GET',
        path: '/{id}',
        description: 'Get notification by ID',
        pathParams: ['id'],
      },
      {
        method: 'PATCH',
        path: '/{id}/read',
        description: 'Mark as read',
        pathParams: ['id'],
      },
      {
        method: 'DELETE',
        path: '/{id}',
        description: 'Delete notification',
        pathParams: ['id'],
      },
    ],
  },
];

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  POST: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  PUT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  PATCH: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  DELETE: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
};

interface ApiResponse {
  status: number;
  statusText: string;
  data: unknown;
  time: number;
}

export default function ApiTesterPage() {
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(
    null
  );
  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState('');
  const [requestBody, setRequestBody] = useState('{\n  \n}');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const service = apiServices.find((s) => s.name === selectedService);
  const endpoints = service?.endpoints || [];

  const handleServiceChange = (serviceName: string) => {
    setSelectedService(serviceName);
    setSelectedEndpoint(null);
    setPathParams({});
    setResponse(null);
    setError(null);
  };

  const handleEndpointChange = (path: string) => {
    const endpoint = endpoints.find((e) => e.path === path);
    setSelectedEndpoint(endpoint || null);
    setPathParams({});
    setResponse(null);
    setError(null);
    if (endpoint?.hasBody) {
      setRequestBody('{\n  \n}');
    }
  };

  const buildUrl = (): string => {
    if (!service || !selectedEndpoint) return '';
    let path = selectedEndpoint.path;

    // Replace path params
    for (const [key, value] of Object.entries(pathParams)) {
      path = path.replace(`{${key}}`, value);
    }

    let url = buildEndpoint(`${service.basePath}${path}`);

    // Add query params
    if (queryParams.trim()) {
      url += (url.includes('?') ? '&' : '?') + queryParams;
    }

    return url;
  };

  const handleSend = async () => {
    if (!selectedEndpoint) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    const startTime = performance.now();

    try {
      const url = buildUrl();
      const options: RequestInit = {
        method: selectedEndpoint.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (selectedEndpoint.hasBody && requestBody.trim()) {
        try {
          JSON.parse(requestBody); // Validate JSON
          options.body = requestBody;
        } catch {
          setError('Invalid JSON in request body');
          setIsLoading(false);
          return;
        }
      }

      const res = await fetch(url, options);
      const endTime = performance.now();

      let data: unknown;
      const contentType = res.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        data,
        time: Math.round(endTime - startTime),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-shrink-0 space-y-3 border-b bg-background px-4 py-3">
        <div className="flex items-center gap-2">
          <Send className="h-5 w-5 text-rose-500" />
          <h2 className="font-semibold text-lg">API Tester</h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Test backend API endpoints directly. Requests use your current session
          cookies.
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto max-w-4xl space-y-4">
          {/* Service & Endpoint Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Service</Label>
                  <Select
                    value={selectedService}
                    onValueChange={handleServiceChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {apiServices.map((s) => (
                        <SelectItem key={s.name} value={s.name}>
                          {s.name} ({s.basePath})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Endpoint</Label>
                  <Select
                    value={selectedEndpoint?.path || ''}
                    onValueChange={handleEndpointChange}
                    disabled={!selectedService}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select endpoint" />
                    </SelectTrigger>
                    <SelectContent>
                      {endpoints.map((e) => (
                        <SelectItem key={e.path} value={e.path}>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`${methodColors[e.method]} text-xs`}
                            >
                              {e.method}
                            </Badge>
                            <span>{e.path}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedEndpoint && (
                <>
                  {/* URL Preview */}
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <div className="flex items-center gap-2 rounded-md bg-muted p-2">
                      <Badge className={methodColors[selectedEndpoint.method]}>
                        {selectedEndpoint.method}
                      </Badge>
                      <code className="flex-1 break-all font-mono text-sm">
                        {buildUrl()}
                      </code>
                    </div>
                  </div>

                  {/* Path Parameters */}
                  {selectedEndpoint.pathParams &&
                    selectedEndpoint.pathParams.length > 0 && (
                      <div className="space-y-2">
                        <Label>Path Parameters</Label>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {selectedEndpoint.pathParams.map((param) => (
                            <div key={param} className="space-y-1">
                              <Label className="text-muted-foreground text-xs">
                                {`{${param}}`}
                              </Label>
                              <Input
                                value={pathParams[param] || ''}
                                onChange={(e) =>
                                  setPathParams({
                                    ...pathParams,
                                    [param]: e.target.value,
                                  })
                                }
                                placeholder={param}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Query Parameters */}
                  <div className="space-y-2">
                    <Label>Query Parameters</Label>
                    <Input
                      value={queryParams}
                      onChange={(e) => setQueryParams(e.target.value)}
                      placeholder="page=0&size=20"
                    />
                  </div>

                  {/* Request Body */}
                  {selectedEndpoint.hasBody && (
                    <div className="space-y-2">
                      <Label>Request Body (JSON)</Label>
                      <Textarea
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        className="min-h-32 font-mono text-sm"
                        placeholder="Enter JSON body..."
                      />
                    </div>
                  )}

                  <Button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Send Request
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Response */}
          {(response || error) && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Response</CardTitle>
                  {response && (
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          response.status >= 200 && response.status < 300
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : response.status >= 400
                              ? 'bg-rose-500/10 text-rose-600'
                              : 'bg-amber-500/10 text-amber-600'
                        }
                      >
                        {response.status} {response.statusText}
                      </Badge>
                      <span className="flex items-center gap-1 text-muted-foreground text-sm">
                        <Clock className="h-3 w-3" />
                        {response.time}ms
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {error ? (
                  <div className="rounded-md bg-rose-500/10 p-4 text-rose-600">
                    {error}
                  </div>
                ) : response ? (
                  <JsonViewer data={response.data} maxHeight="400px" />
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
