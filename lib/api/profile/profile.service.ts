import { buildEndpoint } from '@/lib/api';
import { HttpError } from '@/lib/http';
import { fetchWithAuth } from '../fetch-with-auth';
import type {
  CompanyProfile,
  CompanyProfileResponse,
  CompanyProfileUpdate,
} from './profile.types';

/**
 * Profile API Service
 *
 * Provides CRUD operations for company profiles.
 * All endpoints are automatically prefixed with the configured base URL.
 */

const PROFILE_ENDPOINT = 'profile';

/**
 * Get a company profile by ID
 * Endpoint: GET /v1/profile/:id
 */
export async function getProfile(id: string): Promise<CompanyProfile> {
  const url = buildEndpoint(`${PROFILE_ENDPOINT}/${id}`);

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

  const result: CompanyProfileResponse = await response.json();
  return result.data ?? (result as unknown as CompanyProfile);
}

/**
 * Get all company profiles
 * Endpoint: GET /v1/profile/profiles
 */
export async function getAllProfiles(): Promise<CompanyProfile[]> {
  const url = buildEndpoint(`${PROFILE_ENDPOINT}/profiles`);

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
 * Update a company profile by ID
 * Endpoint: PATCH /v1/profile/:id
 */
export async function updateProfile(
  id: string,
  data: CompanyProfileUpdate
): Promise<CompanyProfile> {
  const url = buildEndpoint(`${PROFILE_ENDPOINT}/${id}`);

  // Clean the data - remove undefined values
  const cleanedData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );

  const response = await fetchWithAuth(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cleanedData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return { id, ...cleanedData } as CompanyProfile;
  }

  const result: CompanyProfileResponse = await response.json();
  return result.data ?? (result as unknown as CompanyProfile);
}

/**
 * Delete a company profile by ID
 * Endpoint: DELETE /v1/profile/:id
 */
export async function deleteProfile(id: string): Promise<{ success: boolean }> {
  const url = buildEndpoint(`${PROFILE_ENDPOINT}/${id}`);

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
 * Profile API object with all methods
 */
export const profileApi = {
  get: getProfile,
  getAll: getAllProfiles,
  update: updateProfile,
  delete: deleteProfile,
} as const;
