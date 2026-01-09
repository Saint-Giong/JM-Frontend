import { z } from 'zod';

/**
 * Company entity schema and types
 */

// Base company data schema (for create/update operations)
export const companyDataSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  aboutUs: z.string().optional(),
  admissionDescription: z.string().optional(),
  logoUrl: z.string().optional(),
  id: z.string().uuid().optional(),
});

// Company schema with ID (for responses)
export const companySchema = companyDataSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Partial company data for updates
export const companyUpdateSchema = companyDataSchema.partial();

// Type exports
export type Company = z.infer<typeof companySchema>;
export type CompanyData = z.infer<typeof companyDataSchema>;
export type CompanyUpdate = z.infer<typeof companyUpdateSchema>;

// API Response types
export interface CompanyResponse {
  data: Company;
  message?: string;
}

export interface CompanyListResponse {
  data: Company[];
  total: number;
  page?: number;
  limit?: number;
}

export interface CompanyDeleteResponse {
  success: boolean;
  message?: string;
}
