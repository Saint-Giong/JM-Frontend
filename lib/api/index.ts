// Configuration

// Re-export company API from its dedicated location
export {
  type Company,
  type CompanyData,
  type CompanyDeleteResponse,
  type CompanyListResponse,
  type CompanyResponse,
  type CompanyUpdate,
  companyApi,
  companyDataSchema,
  companySchema,
  companyUpdateSchema,
  createCompany,
  deleteCompany,
  getCompany,
  updateCompany,
} from '@/app/(dashboard)/profile/api';
// Re-export auth API
export * from './auth';
export {
  API_VERSION,
  apiConfig,
  buildEndpoint,
  DEFAULT_API_BASE_URL,
  getApiBaseUrl,
  getApiUrl,
} from './config';
// Re-export fetch with auth
export {
  fetchWithAuth,
  onSessionExpired,
  onTokenRefreshed,
} from './fetch-with-auth';
// Re-export payment API
export * from './payment';
// Re-export profile API
export * from './profile';
