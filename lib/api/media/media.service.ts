import { buildEndpoint } from '@/lib/api';
import { HttpError } from '@/lib/http';
import { fetchWithAuth } from '../fetch-with-auth';
import type {
  CreateMediaRequest,
  MediaEntity,
  MediaResponse,
  MediaUploadResponse,
  UpdateMediaRequest,
  UploadFileOptions,
  UploadLogoOptions,
} from './media.types';

/**
 * Media API Service
 *
 * Provides upload operations for company media files.
 * All endpoints are automatically prefixed with the configured base URL.
 */

const MEDIA_ENDPOINT = 'media';

/**
 * Upload a company logo
 * Endpoint: POST /v1/media/storage/upload-logo
 *
 * @param options - Upload options containing companyId and file
 * @returns Upload response with success status and URL
 */
export async function uploadLogo(
  options: UploadLogoOptions
): Promise<MediaUploadResponse> {
  const { companyId, file } = options;
  const url = buildEndpoint(`${MEDIA_ENDPOINT}/storage/upload-logo`);

  // Create form data with meta (JSON) and file
  const formData = new FormData();

  // Add meta as simple string (backend reads bytes so this works and is safer than Blob w/o filename)
  const meta = JSON.stringify({ companyId });
  formData.append('meta', meta);

  // Add file
  formData.append('file', file);

  const response = await fetchWithAuth(url, {
    method: 'POST',
    body: formData,
    // Don't set Content-Type header - browser will set it with boundary for multipart
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('[Media] Logo upload failed:', response.status, errorData);
    return {
      success: false,
      url: '',
    };
  }

  const result = await response.json();
  return {
    success: result.success ?? result.isSuccess ?? false,
    url: result.url ?? '',
  };
}

/**
 * Validate if a file is a valid logo image
 *
 * @param file - File to validate
 * @returns Object with isValid flag and optional error message
 */
export function validateLogoFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload a PNG, JPEG, or WebP image.',
    };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return {
      isValid: false,
      error: 'File is too large. Maximum size is 2MB.',
    };
  }

  return { isValid: true };
}

/**
 * Upload a generic file for a company
 * Endpoint: POST /v1/media/storage/upload
 *
 * @param options - Upload options containing companyId and file
 * @returns Upload response with success status and URL
 */
export async function uploadFile(
  options: UploadFileOptions
): Promise<MediaUploadResponse> {
  const { companyId, file, description } = options;
  const url = buildEndpoint(`${MEDIA_ENDPOINT}/storage/upload`);

  const formData = new FormData();

  // Add meta as JSON
  const meta = JSON.stringify({ companyId, description });
  formData.append('meta', meta);

  // Add file
  formData.append('file', file);

  const response = await fetchWithAuth(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('[Media] File upload failed:', response.status, errorData);
    return {
      success: false,
      url: '',
    };
  }

  const result = await response.json();
  return {
    success: result.success ?? result.isSuccess ?? false,
    url: result.url ?? '',
  };
}

/**
 * Create a media record (without file upload)
 * Endpoint: POST /v1/media/
 */
export async function createMedia(
  data: CreateMediaRequest
): Promise<MediaEntity> {
  const url = buildEndpoint(`${MEDIA_ENDPOINT}/`);

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

  const result: MediaResponse = await response.json();
  return result.data ?? (result as unknown as MediaEntity);
}

/**
 * Get a media record by ID
 * Endpoint: GET /v1/media/:id
 */
export async function getMedia(id: string): Promise<MediaEntity> {
  const url = buildEndpoint(`${MEDIA_ENDPOINT}/${id}`);

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

  const result: MediaResponse = await response.json();
  return result.data ?? (result as unknown as MediaEntity);
}

/**
 * List media for a company
 * Endpoint: GET /v1/media/?companyId=
 */
export async function listMediaByCompany(
  companyId: string
): Promise<MediaEntity[]> {
  const url = buildEndpoint(`${MEDIA_ENDPOINT}/?companyId=${companyId}`);

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
 * Update a media record
 * Endpoint: PUT /v1/media/:id
 */
export async function updateMedia(
  id: string,
  data: UpdateMediaRequest
): Promise<MediaEntity> {
  const url = buildEndpoint(`${MEDIA_ENDPOINT}/${id}`);

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

  const result: MediaResponse = await response.json();
  return result.data ?? (result as unknown as MediaEntity);
}

/**
 * Delete a media record
 * Endpoint: DELETE /v1/media/:id
 */
export async function deleteMedia(id: string): Promise<{ success: boolean }> {
  const url = buildEndpoint(`${MEDIA_ENDPOINT}/${id}`);

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
 * Media API object with all methods
 */
export const mediaApi = {
  uploadLogo,
  uploadFile,
  validateLogoFile,
  create: createMedia,
  get: getMedia,
  listByCompany: listMediaByCompany,
  update: updateMedia,
  delete: deleteMedia,
} as const;
