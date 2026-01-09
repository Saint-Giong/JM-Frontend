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
