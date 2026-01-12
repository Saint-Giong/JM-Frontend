// Company API Service
export {
  companyApi,
  createCompany,
  deleteCompany,
  getCompany,
  updateCompany,
} from './company.service';

// Company Types
export {
  type Company,
  type CompanyData,
  type CompanyDeleteResponse,
  type CompanyListResponse,
  type CompanyResponse,
  type CompanyUpdate,
  companyDataSchema,
  companySchema,
  companyUpdateSchema,
} from './company.types';
