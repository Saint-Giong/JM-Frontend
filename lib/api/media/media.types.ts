/**
 * Media API Types
 */

export interface MediaUploadResponse {
  url: string;
  success: boolean;
}

export interface UploadLogoOptions {
  companyId: string;
  file: File;
}

export interface UploadFileOptions {
  companyId: string;
  file: File;
  description?: string;
}

/**
 * Media entity from backend
 */
export interface MediaEntity {
  id: string;
  companyId: string;
  fileName: string;
  fileUrl: string;
  contentType: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create media record request
 */
export interface CreateMediaRequest {
  companyId: string;
  fileName: string;
  fileUrl: string;
  contentType: string;
  description?: string;
}

/**
 * Update media record request
 */
export interface UpdateMediaRequest {
  description?: string;
}

/**
 * Generic media response wrapper
 */
export interface MediaResponse<T = MediaEntity> {
  success: boolean;
  message: string;
  data?: T;
}
