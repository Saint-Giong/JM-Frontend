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
// Re-export fetch with auth
export { fetchWithAuth, onSessionExpired, onTokenRefreshed } from './fetch-with-auth';
// Re-export profile API
export * from './profile';
