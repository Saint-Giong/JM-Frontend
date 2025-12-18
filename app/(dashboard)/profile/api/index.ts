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
  companyDataSchema,
  companySchema,
  companyUpdateSchema,
  type Company,
  type CompanyData,
  type CompanyDeleteResponse,
  type CompanyListResponse,
  type CompanyResponse,
  type CompanyUpdate,
} from './company.types';
