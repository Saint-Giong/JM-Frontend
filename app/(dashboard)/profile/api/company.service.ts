import { buildEndpoint } from '@/lib/api';
import { HttpError } from '@/lib/http';
import type {
  Company,
  CompanyData,
  CompanyDeleteResponse,
  CompanyResponse,
  CompanyUpdate,
} from './company.types';

/**
 * Company API Service
 *
 * Provides CRUD operations for company profiles.
 * All endpoints are automatically prefixed with the configured base URL.
 */

const COMPANY_ENDPOINT = 'profile';

/**
 * Create a new company
 */
export async function createCompany(data: CompanyData): Promise<Company> {
  const url = buildEndpoint(COMPANY_ENDPOINT);

  // Clean the data - remove undefined/null values, convert empty strings to null
  const cleanedData = Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, value === '' ? null : value])
  );

  console.log('[Company API] Creating company:', { url, data: cleanedData });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cleanedData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('[Company API] Create failed:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData,
    });
    throw new HttpError(response.status, response.statusText, errorData);
  }

  const result: CompanyResponse = await response.json();
  console.log('[Company API] Create success:', result);
  return result.data ?? (result as unknown as Company);
}

/**
 * Get a company by ID
 */
export async function getCompany(id: string): Promise<Company> {
  const url = buildEndpoint(`${COMPANY_ENDPOINT}/${id}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  const result: CompanyResponse = await response.json();
  return result.data ?? result;
}

/**
 * Update a company by ID
 */
export async function updateCompany(
  id: string,
  data: CompanyUpdate
): Promise<Company> {
  const url = buildEndpoint(`${COMPANY_ENDPOINT}/${id}`);

  // Clean the data - remove undefined values, convert empty strings to null
  const cleanedData = Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, value === '' ? null : value])
  );

  console.log('[Company API] Updating company:', {
    url,
    id,
    data: cleanedData,
  });

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cleanedData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('[Company API] Update failed:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData,
    });
    throw new HttpError(response.status, response.statusText, errorData);
  }

  // Handle 204 No Content - return the data we sent merged with id
  if (response.status === 204) {
    return { id, ...cleanedData } as Company;
  }

  const result: CompanyResponse = await response.json();
  return result.data ?? result;
}

/**
 * Delete a company by ID
 */
export async function deleteCompany(
  id: string
): Promise<CompanyDeleteResponse> {
  const url = buildEndpoint(`${COMPANY_ENDPOINT}/${id}`);

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorData);
  }

  // DELETE might return empty response
  const text = await response.text();
  if (!text) {
    return { success: true };
  }

  return JSON.parse(text);
}

/**
 * Company API object with all CRUD methods
 */
export const companyApi = {
  create: createCompany,
  get: getCompany,
  update: updateCompany,
  delete: deleteCompany,
} as const;
