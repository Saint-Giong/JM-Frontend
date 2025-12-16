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
export {
  API_VERSION,
  apiConfig,
  buildEndpoint,
  DEFAULT_API_BASE_URL,
  getApiBaseUrl,
  getApiUrl,
  SGJM_PREFIX,
} from './config';
