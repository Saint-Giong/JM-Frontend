/**
 * Profile API Types
 */

export interface CompanyProfile {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  aboutUs?: string;
  admissionDescription?: string;
  logoUrl?: string;
}

export interface CompanyProfileUpdate {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  aboutUs?: string;
  admissionDescription?: string;
  logoUrl?: string;
}

export interface CompanyProfileResponse {
  success?: boolean;
  message?: string;
  data?: CompanyProfile;
}
