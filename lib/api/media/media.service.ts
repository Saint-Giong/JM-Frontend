import { buildEndpoint } from '@/lib/api';
import { fetchWithAuth } from '../fetch-with-auth';
import type { MediaUploadResponse, UploadLogoOptions } from './media.types';

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
 * Media API object with all methods
 */
export const mediaApi = {
  uploadLogo,
  validateLogoFile,
} as const;
