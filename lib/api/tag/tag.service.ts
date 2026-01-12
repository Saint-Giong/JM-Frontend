/**
 * Skill Tag API Service
 *
 * Provides CRUD operations for skill tags.
 * All endpoints are automatically prefixed with the configured base URL.
 */

import { buildEndpoint } from '@/lib/api/config';
import { HttpError } from '@/lib/http';
import { fetchWithAuth } from '../fetch-with-auth';
import type {
  CreateSkillTagRequest,
  SkillTag,
  SkillTagListParams,
  SkillTagPage,
  SkillTagPageResponse,
  SkillTagResponse,
  SkillTagSearchParams,
  UpdateSkillTagRequest,
} from './tag.types';

const TAG_ENDPOINT = 'tag';

/**
 * Get all skill tags (paginated)
 * Endpoint: GET /v1/tag/
 *
 * Backend returns: { success, message, data: { content, page: { size, number, totalElements, totalPages } }, timestamp }
 * We normalize to: { content, size, number, totalElements, totalPages }
 */
export async function getAllSkillTags(
  params?: SkillTagListParams
): Promise<SkillTagPage> {
  const searchParams = new URLSearchParams();
  if (params?.page !== undefined) {
    searchParams.set('page', String(params.page));
  }
  if (params?.size !== undefined) {
    searchParams.set('size', String(params.size));
  }

  const queryString = searchParams.toString();
  const url = buildEndpoint(
    `${TAG_ENDPOINT}/${queryString ? `?${queryString}` : ''}`
  );

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

  const result: SkillTagPageResponse = await response.json();

  // Normalize backend response to frontend-friendly format
  return {
    content: result.data.content,
    size: result.data.page.size,
    number: result.data.page.number,
    totalElements: result.data.page.totalElements,
    totalPages: result.data.page.totalPages,
  };
}

/**
 * Get a skill tag by ID
 * Endpoint: GET /v1/tag/:id
 */
export async function getSkillTag(id: number): Promise<SkillTag> {
  const url = buildEndpoint(`${TAG_ENDPOINT}/${id}`);

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

  const result: SkillTagResponse = await response.json();
  return result.data ?? (result as unknown as SkillTag);
}

/**
 * Search skill tags by prefix (autocomplete)
 * Endpoint: GET /v1/tag/search?prefix=
 */
export async function searchSkillTags(
  params: SkillTagSearchParams
): Promise<SkillTag[]> {
  const searchParams = new URLSearchParams();
  searchParams.set('prefix', params.prefix);
  if (params.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }

  const url = buildEndpoint(
    `${TAG_ENDPOINT}/search?${searchParams.toString()}`
  );

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
 * Create a new skill tag
 * Endpoint: POST /v1/tag/create
 */
export async function createSkillTag(
  data: CreateSkillTagRequest
): Promise<SkillTag> {
  const url = buildEndpoint(`${TAG_ENDPOINT}/create`);

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

  const result: SkillTagResponse = await response.json();
  return result.data ?? (result as unknown as SkillTag);
}

/**
 * Update a skill tag
 * Endpoint: PUT /v1/tag/:id
 */
export async function updateSkillTag(
  id: number,
  data: UpdateSkillTagRequest
): Promise<SkillTag> {
  const url = buildEndpoint(`${TAG_ENDPOINT}/${id}`);

  const response = await fetchWithAuth(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  const result: SkillTagResponse = await response.json();
  return result.data ?? (result as unknown as SkillTag);
}

/**
 * Delete a skill tag
 * Endpoint: DELETE /v1/tag/:id
 */
export async function deleteSkillTag(
  id: number
): Promise<{ success: boolean }> {
  const url = buildEndpoint(`${TAG_ENDPOINT}/${id}`);

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

  return { success: true };
}

/**
 * Skill Tag API object with all methods
 */
export const skillTagApi = {
  getAll: getAllSkillTags,
  get: getSkillTag,
  search: searchSkillTags,
  create: createSkillTag,
  update: updateSkillTag,
  delete: deleteSkillTag,
} as const;
