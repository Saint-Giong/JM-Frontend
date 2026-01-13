/**
 * Applicant Discovery API Types
 *
 * TypeScript types corresponding to the backend Discovery service DTOs.
 * This service provides applicant search via Elasticsearch.
 */

/**
 * Education degree types (matches backend enum)
 */
export type DegreeType = 'BACHELOR' | 'MASTER' | 'DOCTORATE';

/**
 * Employment type (matches backend BitSet representation)
 * Backend uses indices: FULL_TIME=0, PART_TIME=1, FRESHER=2, INTERNSHIP=3, CONTRACT=4
 */
export type BackendEmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'FRESHER'
  | 'INTERNSHIP'
  | 'CONTRACT';

/**
 * Education entity from Elasticsearch
 */
export interface Education {
  educationId: string;
  applicantId: string;
  institutionName: string;
  degree: DegreeType;
  gpa: number;
  description: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Work experience entity from Elasticsearch
 */
export interface WorkExperience {
  experienceId: string;
  applicantId: string;
  companyName: string;
  position: string;
  description: string;
  country: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Applicant document from Elasticsearch
 */
export interface ApplicantDocument {
  applicantId: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  biography: string;
  avatarUrl: string;
  country: string;
  educations: Education[];
  workExperiences: WorkExperience[];
  skillIds: number[];
  skillNames?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Paginated response for applicants
 */
export interface ApplicantPage {
  content: ApplicantDocument[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page (0-indexed)
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * Parameters for listing all applicants
 */
export interface ApplicantListParams {
  page?: number;
  size?: number;
}

/**
 * Parameters for searching applicants
 */
export interface ApplicantSearchParams {
  page?: number;
  size?: number;
  country?: string;
  city?: string;
  skillIds?: number[];
  degree?: DegreeType;
  employmentTypes?: BackendEmploymentType[];
  query?: string; // full-text search
  salaryMin?: number;
  salaryMax?: number;
}

/**
 * Search profile entity for saved searches
 */
export interface SearchProfile {
  profileId: string;
  name?: string; // Frontend-only, may not exist in backend
  salaryMin: number | null;
  salaryMax: number | null;
  highestDegree: DegreeType | null;
  employmentType: number[]; // BitSet indices
  country: string | null;
  companyId: string;
  skillTags: number[]; // skill tag IDs
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Request DTO for creating a search profile
 */
export interface CreateSearchProfileRequest {
  salaryMin?: number | null;
  salaryMax?: number | null;
  highestDegree?: DegreeType | null;
  employmentType?: number[];
  country?: string | null;
  companyId: string;
  skillTags?: number[];
}

/**
 * Request DTO for updating a search profile
 */
export interface UpdateSearchProfileRequest {
  salaryMin?: number | null;
  salaryMax?: number | null;
  highestDegree?: DegreeType | null;
  employmentType?: number[];
  country?: string | null;
  skillTags?: number[];
}

/**
 * Generic response wrapper from backend
 */
export interface DiscoveryResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// ============================================
// Type transformation utilities
// ============================================

/**
 * Employment type to BitSet index mapping
 */
const EMPLOYMENT_TYPE_INDEX: Record<BackendEmploymentType, number> = {
  FULL_TIME: 0,
  PART_TIME: 1,
  FRESHER: 2,
  INTERNSHIP: 3,
  CONTRACT: 4,
};

/**
 * BitSet index to employment type mapping
 */
const INDEX_TO_EMPLOYMENT_TYPE: Record<number, BackendEmploymentType> = {
  0: 'FULL_TIME',
  1: 'PART_TIME',
  2: 'FRESHER',
  3: 'INTERNSHIP',
  4: 'CONTRACT',
};

/**
 * Convert employment types to BitSet indices
 */
export function toEmploymentTypeIndices(
  types: BackendEmploymentType[]
): number[] {
  return types.map((type) => EMPLOYMENT_TYPE_INDEX[type]);
}

/**
 * Convert BitSet indices to employment types
 */
export function fromEmploymentTypeIndices(
  indices: number[]
): BackendEmploymentType[] {
  return indices
    .map((index) => INDEX_TO_EMPLOYMENT_TYPE[index])
    .filter(Boolean);
}

/**
 * Get the highest degree from education list
 */
export function getHighestDegree(
  educationList: Education[]
): DegreeType | null {
  const degreeOrder: DegreeType[] = ['BACHELOR', 'MASTER', 'DOCTORATE'];

  let highestIndex = -1;
  for (const education of educationList) {
    const index = degreeOrder.indexOf(education.degree);
    if (index > highestIndex) {
      highestIndex = index;
    }
  }

  return highestIndex >= 0 ? degreeOrder[highestIndex] : null;
}

/**
 * Get full name from applicant document
 */
export function getApplicantFullName(applicant: ApplicantDocument): string {
  return `${applicant.firstName} ${applicant.lastName}`.trim();
}
