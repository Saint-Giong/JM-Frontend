import { buildEndpoint } from '@/lib/api';
import { HttpError } from '@/lib/http';
import { fetchWithAuth } from '../fetch-with-auth';
import type {
  CreateJobPostRequest,
  CreateJobPostResponse,
  JobPostResponse,
  UpdateJobPostRequest,
} from './jobpost.types';

/**
 * Job Post API Service
 *
 * Provides CRUD operations for job posts.
 * All endpoints are automatically prefixed with the configured base URL.
 */

const JOBPOST_ENDPOINT = 'jobpost';

/**
 * Get a job post by ID
 * Endpoint: GET /v1/jobpost/:id
 */
export async function getJobPost(id: string): Promise<JobPostResponse> {
  const url = buildEndpoint(`${JOBPOST_ENDPOINT}/${id}`);

  const response = await fetchWithAuth(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  const result = await response.json();
  console.log('getJobPost API response:', result);
  // Handle wrapped response (result.data) or direct response
  const jobData = result.data ?? result;
  console.log('Extracted job data:', jobData);
  console.log('skillTagIds in response:', jobData.skillTagIds);
  return jobData;
}

/**
 * Get all job posts for a company
 * Endpoint: GET /v1/jobpost/search/:companyId
 */
export async function getJobPostsByCompany(
  companyId: string
): Promise<JobPostResponse[]> {
  const url = buildEndpoint(`${JOBPOST_ENDPOINT}/search/${companyId}`);

  const response = await fetchWithAuth(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  const result = await response.json();
  console.log('getJobPostsByCompany API response:', result);
  const jobs = Array.isArray(result) ? result : (result.data ?? []);
  console.log('Extracted jobs array:', jobs);
  if (jobs.length > 0) {
    console.log('First job skillTagIds:', jobs[0].skillTagIds);
  }
  return jobs;
}

/**
 * Get all job posts (test endpoint)
 * Endpoint: GET /v1/jobpost/
 */
export async function getAllJobPosts(): Promise<JobPostResponse[]> {
  const url = buildEndpoint(`${JOBPOST_ENDPOINT}/`);

  const response = await fetchWithAuth(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  const result = await response.json();
  return Array.isArray(result) ? result : (result.data ?? []);
}

/**
 * Create a new job post
 * Endpoint: POST /v1/jobpost/
 */
export async function createJobPost(
  data: CreateJobPostRequest
): Promise<CreateJobPostResponse> {
  const url = buildEndpoint(`${JOBPOST_ENDPOINT}/`);

  const response = await fetchWithAuth(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  return response.json();
}

/**
 * Update an existing job post
 * Endpoint: PATCH /v1/jobpost/:id
 */
export async function updateJobPost(
  id: string,
  data: UpdateJobPostRequest
): Promise<void> {
  const url = buildEndpoint(`${JOBPOST_ENDPOINT}/${id}`);

  const response = await fetchWithAuth(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  // 204 No Content response
}

/**
 * Delete a job post
 * Endpoint: DELETE /v1/jobpost/:id
 */
export async function deleteJobPost(id: string): Promise<void> {
  const url = buildEndpoint(`${JOBPOST_ENDPOINT}/${id}`);

  const response = await fetchWithAuth(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  // 204 No Content response
}

/**
 * Job Post API object with all methods
 */
export const jobPostApi = {
  get: getJobPost,
  getByCompany: getJobPostsByCompany,
  getAll: getAllJobPosts,
  create: createJobPost,
  update: updateJobPost,
  delete: deleteJobPost,
} as const;
