// Configuration

// Re-export company API from its dedicated location
export {
  companyApi,
  companyDataSchema,
  companySchema,
  companyUpdateSchema,
  createCompany,
  deleteCompany,
  getCompany,
  updateCompany,
  type Company,
  type CompanyData,
  type CompanyDeleteResponse,
  type CompanyListResponse,
  type CompanyResponse,
  type CompanyUpdate,
} from '@/app/(dashboard)/profile/api';
// Re-export auth API
export * from './auth';
export {
  API_VERSION,
  DEFAULT_API_BASE_URL,
  apiConfig,
  buildEndpoint,
  getApiBaseUrl,
  getApiUrl,
} from './config';
// Re-export discovery API (Applicant Search) - explicitly to avoid conflicts
export {
  discoveryApi,
  type ApplicantDocument,
  type ApplicantListParams,
  type ApplicantPage,
  type ApplicantSearchParams,
  type CreateSearchProfileRequest,
  type DegreeType,
  type DiscoveryResponse,
  type Education,
  type SearchProfile,
  type UpdateSearchProfileRequest,
  type WorkExperience,
  fromEmploymentTypeIndices,
  getApplicantFullName,
  getHighestDegree,
  toEmploymentTypeIndices,
} from './discovery';
// Re-export fetch with auth
export {
  fetchWithAuth,
  onSessionExpired,
  onTokenRefreshed,
} from './fetch-with-auth';
// Re-export job post API
export * from './jobpost';
// Re-export media API
export * from './media';
// Re-export notification API
export * from './notifications';
// Re-export payment API
export * from './payment';
// Re-export profile API
export * from './profile';
// Re-export subscription API
export * from './subscription';
// Re-export skill tag API
export * from './tag';
