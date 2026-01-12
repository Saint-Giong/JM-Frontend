/**
 * Applicant Discovery API Service
 *
 * Provides applicant search and search profile operations.
 * All endpoints are automatically prefixed with the configured base URL.
 */

import { buildEndpoint } from '@/lib/api/config';
import { HttpError } from '@/lib/http';
import { fetchWithAuth } from '../fetch-with-auth';
import type {
  ApplicantDocument,
  ApplicantListParams,
  ApplicantPage,
  ApplicantSearchParams,
  CreateSearchProfileRequest,
  DiscoveryResponse,
  SearchProfile,
  UpdateSearchProfileRequest,
} from './discovery.types';

const DISCOVERY_ENDPOINT = 'discovery';

// ============================================
// Applicant APIs
// ============================================

/**
 * Get all applicants (paginated)
 * Endpoint: GET /v1/discovery/applicants/all
 */
export async function getAllApplicants(
  params?: ApplicantListParams
): Promise<ApplicantPage> {
  const searchParams = new URLSearchParams();
  if (params?.page !== undefined) {
    searchParams.set('page', String(params.page));
  }
  if (params?.size !== undefined) {
    searchParams.set('size', String(params.size));
  }

  const queryString = searchParams.toString();
  const url = buildEndpoint(
    `${DISCOVERY_ENDPOINT}/applicants/all${queryString ? `?${queryString}` : ''}`
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

  return response.json();
}

/**
 * Get a single applicant by ID
 * Endpoint: GET /v1/discovery/applicants/:id
 */
export async function getApplicant(id: string): Promise<ApplicantDocument> {
  const url = buildEndpoint(`${DISCOVERY_ENDPOINT}/applicants/${id}`);

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

  const result: DiscoveryResponse<ApplicantDocument> = await response.json();
  return result.data ?? (result as unknown as ApplicantDocument);
}

/**
 * Search applicants with filters
 * Endpoint: GET /v1/discovery/applicants/search
 */
export async function searchApplicants(
  params: ApplicantSearchParams
): Promise<ApplicantPage> {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set('page', String(params.page));
  }
  if (params.size !== undefined) {
    searchParams.set('size', String(params.size));
  }
  if (params.country) {
    searchParams.set('country', params.country);
  }
  if (params.city) {
    searchParams.set('city', params.city);
  }
  if (params.degree) {
    searchParams.set('degree', params.degree);
  }
  if (params.query) {
    searchParams.set('query', params.query);
  }
  if (params.salaryMin !== undefined) {
    searchParams.set('salaryMin', String(params.salaryMin));
  }
  if (params.salaryMax !== undefined) {
    searchParams.set('salaryMax', String(params.salaryMax));
  }
  if (params.skillIds && params.skillIds.length > 0) {
    searchParams.set('skillIds', params.skillIds.join(','));
  }
  if (params.employmentTypes && params.employmentTypes.length > 0) {
    searchParams.set('employmentTypes', params.employmentTypes.join(','));
  }

  const url = buildEndpoint(
    `${DISCOVERY_ENDPOINT}/applicants/search?${searchParams.toString()}`
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

  return response.json();
}

// ============================================
// Search Profile APIs
// ============================================

/**
 * Create a new search profile
 * Endpoint: POST /v1/discovery/search-profile
 */
export async function createSearchProfile(
  data: CreateSearchProfileRequest
): Promise<SearchProfile> {
  const url = buildEndpoint(`${DISCOVERY_ENDPOINT}/search-profile`);

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

  const result: DiscoveryResponse<SearchProfile> = await response.json();
  return result.data ?? (result as unknown as SearchProfile);
}

/**
 * Get a search profile by ID
 * Endpoint: GET /v1/discovery/search-profile/:id
 */
export async function getSearchProfile(id: string): Promise<SearchProfile> {
  const url = buildEndpoint(`${DISCOVERY_ENDPOINT}/search-profile/${id}`);

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

  const result: DiscoveryResponse<SearchProfile> = await response.json();
  return result.data ?? (result as unknown as SearchProfile);
}

/**
 * Get all search profiles for a company
 * Endpoint: GET /v1/discovery/search-profile/company/:companyId
 */
export async function getSearchProfilesByCompany(
  companyId: string
): Promise<SearchProfile[]> {
  const url = buildEndpoint(
    `${DISCOVERY_ENDPOINT}/search-profile/company/${companyId}`
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
 * Update a search profile
 * Endpoint: PUT /v1/discovery/search-profile/:id
 */
export async function updateSearchProfile(
  id: string,
  data: UpdateSearchProfileRequest
): Promise<SearchProfile> {
  const url = buildEndpoint(`${DISCOVERY_ENDPOINT}/search-profile/${id}`);

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

  const result: DiscoveryResponse<SearchProfile> = await response.json();
  return result.data ?? (result as unknown as SearchProfile);
}

/**
 * Delete a search profile
 * Endpoint: DELETE /v1/discovery/search-profile/:id
 */
export async function deleteSearchProfile(
  id: string
): Promise<{ success: boolean }> {
  const url = buildEndpoint(`${DISCOVERY_ENDPOINT}/search-profile/${id}`);

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
 * Discovery API object with all methods
 */
export const discoveryApi = {
  // Applicants
  getAllApplicants,
  getApplicant,
  searchApplicants,
  // Search profiles
  createSearchProfile,
  getSearchProfile,
  getSearchProfilesByCompany,
  updateSearchProfile,
  deleteSearchProfile,
} as const;
