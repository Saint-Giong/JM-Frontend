/**
 * Job Post API Types
 *
 * TypeScript types that match the backend JM-JobPostService DTOs.
 */

// Backend employment type format (uppercase with underscore)
export type BackendEmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'INTERNSHIP'
  | 'CONTRACT';

// Backend salary title format
export type BackendSalaryTitle =
  | 'RANGE'
  | 'ABOUT'
  | 'UP_TO'
  | 'FROM'
  | 'NEGOTIABLE';

/**
 * Response DTO for querying job post details
 * Maps to QueryJobPostResponseDto from backend
 */
export interface JobPostResponse {
  id: string;
  title: string;
  description: string;
  city: string;
  country: string;
  employmentTypes: BackendEmploymentType[];
  skillTagIds: number[];
  salaryTitle: BackendSalaryTitle;
  salaryMin: number | null;
  salaryMax: number | null;
  postedDate: string; // ISO datetime string
  expiryDate: string; // ISO datetime string
  published: boolean;
  companyId: string;
}

/**
 * Request DTO for creating a new job post
 * Maps to CreateJobPostRequestDto from backend
 */
export interface CreateJobPostRequest {
  title: string;
  description: string;
  city: string;
  country: string;
  employmentTypes: BackendEmploymentType[];
  skillTagIds?: number[];
  salaryTitle: BackendSalaryTitle;
  salaryMin?: number;
  salaryMax?: number;
  expiryDate: string; // ISO datetime string
  isPublished: boolean;
  companyId: string;
}

/**
 * Request DTO for updating an existing job post
 * Maps to UpdateJobPostRequestDto from backend
 */
export interface UpdateJobPostRequest {
  title: string;
  description: string;
  city: string;
  country: string;
  employmentTypes: BackendEmploymentType[];
  skillTagIds?: number[];
  salaryTitle: BackendSalaryTitle;
  salaryMin?: number;
  salaryMax?: number;
  expiryDate: string; // ISO datetime string
  isPublished: boolean;
  companyId: string;
}

/**
 * Response DTO for creating a job post
 * Maps to CreateJobPostResponseDto from backend
 */
export interface CreateJobPostResponse {
  id: string;
  title: string;
  description: string;
  city: string;
  country: string;
  employmentTypes: BackendEmploymentType[];
  skillTagIds: number[];
  salaryTitle: BackendSalaryTitle;
  salaryMin: number | null;
  salaryMax: number | null;
  expiryDate: string;
  published: boolean;
  companyId: string;
}

/**
 * API response wrapper (some endpoints may wrap data)
 */
export interface JobPostApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

// ==================== Transformation Utilities ====================

import type { EmploymentType } from '@/components/applicant/types';
import type {
  Job,
  JobFormData,
  JobPost,
  JobSalary,
  JobStatus,
} from '@/components/job/types';

/**
 * Convert frontend employment type to backend format
 */
export function toBackendEmploymentType(
  type: EmploymentType
): BackendEmploymentType {
  const mapping: Record<EmploymentType, BackendEmploymentType> = {
    'full-time': 'FULL_TIME',
    'part-time': 'PART_TIME',
    internship: 'INTERNSHIP',
    contract: 'CONTRACT',
  };
  return mapping[type];
}

/**
 * Convert backend employment type to frontend format
 */
export function toFrontendEmploymentType(
  type: BackendEmploymentType
): EmploymentType {
  const mapping: Record<BackendEmploymentType, EmploymentType> = {
    FULL_TIME: 'full-time',
    PART_TIME: 'part-time',
    INTERNSHIP: 'internship',
    CONTRACT: 'contract',
  };
  return mapping[type];
}

/**
 * Convert frontend salary to backend format
 */
export function toBackendSalary(salary: JobSalary): {
  salaryTitle: BackendSalaryTitle;
  salaryMin?: number;
  salaryMax?: number;
} {
  switch (salary.type) {
    case 'range':
      return {
        salaryTitle: 'RANGE',
        salaryMin: salary.min,
        salaryMax: salary.max,
      };
    case 'estimation': {
      const titleMapping: Record<
        'about' | 'up-to' | 'from',
        BackendSalaryTitle
      > = {
        about: 'ABOUT',
        'up-to': 'UP_TO',
        from: 'FROM',
      };
      return {
        salaryTitle: titleMapping[salary.estimationType],
        salaryMin: salary.amount,
        salaryMax: salary.amount,
      };
    }
    case 'negotiable':
      return { salaryTitle: 'NEGOTIABLE' };
  }
}

/**
 * Convert backend salary to frontend format
 */
export function toFrontendSalary(
  salaryTitle: BackendSalaryTitle,
  salaryMin: number | null,
  salaryMax: number | null,
  currency = 'USD'
): JobSalary {
  switch (salaryTitle) {
    case 'RANGE':
      return {
        type: 'range',
        min: salaryMin ?? 0,
        max: salaryMax ?? 0,
        currency,
      };
    case 'ABOUT':
      return {
        type: 'estimation',
        estimationType: 'about',
        amount: salaryMin ?? 0,
        currency,
      };
    case 'UP_TO':
      return {
        type: 'estimation',
        estimationType: 'up-to',
        amount: salaryMax ?? 0,
        currency,
      };
    case 'FROM':
      return {
        type: 'estimation',
        estimationType: 'from',
        amount: salaryMin ?? 0,
        currency,
      };
    case 'NEGOTIABLE':
      return { type: 'negotiable' };
    default:
      return { type: 'negotiable' };
  }
}

/**
 * Convert backend response to frontend JobPost type
 */
export function toJobPost(response: JobPostResponse): JobPost {
  const skillTagIds = response.skillTagIds ?? [];
  console.log('toJobPost - skillTagIds:', skillTagIds);
  return {
    id: response.id,
    title: response.title,
    description: response.description,
    status: response.published ? 'published' : ('draft' as JobStatus),
    employmentTypes: response.employmentTypes.map(toFrontendEmploymentType),
    postedAt: formatRelativeDate(response.postedDate),
    expiryDate: formatDate(response.expiryDate),
    salary: toFrontendSalary(
      response.salaryTitle,
      response.salaryMin,
      response.salaryMax
    ),
    location: `${response.city}${response.country ? `, ${response.country}` : ''}`,
    skills: skillTagIds.map((id) => `Skill ${id}`), // Placeholder until resolved
    skillTagIds: skillTagIds,
    applicantCount: 0, // TODO: Get from applications service
    hasNewApplicants: false,
  };
}

/**
 * Convert backend response to frontend Job type (for list views)
 */
export function toJob(response: JobPostResponse): Job {
  const salary = toFrontendSalary(
    response.salaryTitle,
    response.salaryMin,
    response.salaryMax
  );
  const skillTagIds = response.skillTagIds ?? [];
  console.log('toJob - skillTagIds:', skillTagIds);

  return {
    id: response.id,
    title: response.title,
    description: response.description,
    status: response.published ? 'published' : ('draft' as JobStatus),
    applicants: 0, // TODO: Get from applications service
    hasNewApplicants: false,
    postedAt: formatRelativeDate(response.postedDate),
    deadline: formatDate(response.expiryDate),
    location: `${response.city}${response.country ? `, ${response.country}` : ''}`,
    jobType: response.employmentTypes.map(toFrontendEmploymentType).join(', '),
    salaryMin: salary.type === 'range' ? salary.min : 0,
    salaryMax: salary.type === 'range' ? salary.max : 0,
    skills: skillTagIds.map((id) => `Skill ${id}`),
    skillTagIds: skillTagIds,
  };
}

/**
 * Convert frontend form data to backend create request
 */
export function toCreateRequest(
  data: JobFormData,
  companyId: string,
  isPublished = false
): CreateJobPostRequest {
  const [city, country] = parseLocation(data.location);
  const salaryData = toBackendSalary(data.salary);

  return {
    title: data.title,
    description: data.description,
    city,
    country,
    employmentTypes: data.employmentTypes.map(toBackendEmploymentType),
    skillTagIds: [], // TODO: Convert skill names to IDs
    ...salaryData,
    expiryDate: data.expiryDate
      ? new Date(data.expiryDate).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Default 30 days
    isPublished,
    companyId,
  };
}

/**
 * Convert frontend form data to backend update request
 */
export function toUpdateRequest(
  data: JobFormData,
  companyId: string,
  isPublished = false
): UpdateJobPostRequest {
  const [city, country] = parseLocation(data.location);
  const salaryData = toBackendSalary(data.salary);

  return {
    title: data.title,
    description: data.description,
    city,
    country,
    employmentTypes: data.employmentTypes.map(toBackendEmploymentType),
    skillTagIds: [], // TODO: Convert skill names to IDs
    ...salaryData,
    expiryDate: data.expiryDate
      ? new Date(data.expiryDate).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isPublished,
    companyId,
  };
}

/**
 * Convert backend response to frontend form data (for editing)
 */
export function toFormData(response: JobPostResponse): Partial<JobFormData> {
  return {
    title: response.title,
    description: response.description,
    employmentTypes: response.employmentTypes.map(toFrontendEmploymentType),
    salary: toFrontendSalary(
      response.salaryTitle,
      response.salaryMin,
      response.salaryMax
    ),
    location: `${response.city}${response.country ? `, ${response.country}` : ''}`,
    skills: response.skillTagIds.map((id) => `Skill ${id}`),
    expiryDate: response.expiryDate
      ? new Date(response.expiryDate).toISOString().split('T')[0]
      : undefined,
  };
}

// ==================== Helper Functions ====================

/**
 * Parse location string into city and country
 */
function parseLocation(location: string): [string, string] {
  const parts = location.split(',').map((p) => p.trim());
  return [parts[0] || '', parts[1] || 'Vietnam'];
}

/**
 * Format ISO date string to display format
 */
function formatDate(isoDate: string): string {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format ISO date to relative time (e.g., "2 days ago")
 */
function formatRelativeDate(isoDate: string): string {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'A day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return '1 month ago';
  return `${Math.floor(diffDays / 30)} months ago`;
}
