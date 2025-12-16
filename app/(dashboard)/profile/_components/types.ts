export type { Job } from '@/components/job';
export type { Company, CompanyData, CompanyUpdate } from '@/lib/api';

export interface ProfileFormData {
  companyName: string;
  website: string;
  aboutUs: string;
  whoWeAreLookingFor: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
}

/**
 * Convert ProfileFormData to CompanyUpdate for API calls
 */
export function toCompanyUpdate(
  formData: Partial<ProfileFormData>
): import('@/lib/api').CompanyUpdate {
  return {
    name: formData.companyName,
    phone: formData.phone,
    address: formData.address,
    city: formData.city,
    country: formData.country,
    aboutUs: formData.aboutUs,
    admissionDescription: formData.whoWeAreLookingFor,
  };
}

/**
 * Convert Company to ProfileFormData for form display
 */
export function fromCompany(
  company: import('@/lib/api').Company,
  defaults?: Partial<ProfileFormData>
): ProfileFormData {
  return {
    companyName: company.name,
    website: defaults?.website ?? '',
    aboutUs: company.aboutUs ?? '',
    whoWeAreLookingFor: company.admissionDescription ?? '',
    address: company.address ?? '',
    city: company.city ?? '',
    country: company.country ?? '',
    phone: company.phone ?? '',
    email: defaults?.email ?? '',
  };
}
