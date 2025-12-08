import type { Applicant, EmploymentType } from '@/components/applicant/types';

// Re-export for convenience
export type { EmploymentType } from '@/components/applicant/types';

// Job status
export type JobStatus = 'archived' | 'draft' | 'hiring' | 'published';

// Salary format types
export type SalaryType = 'range' | 'estimation' | 'negotiable';
export type EstimationType = 'about' | 'up-to' | 'from';

export interface JobSalaryRange {
  type: 'range';
  min: number;
  max: number;
  currency: string;
}

export interface JobSalaryEstimation {
  type: 'estimation';
  estimationType: EstimationType;
  amount: number;
  currency: string;
}

export interface JobSalaryNegotiable {
  type: 'negotiable';
}

export type JobSalary =
  | JobSalaryRange
  | JobSalaryEstimation
  | JobSalaryNegotiable;

// Base job interface (for list views)
export interface Job {
  id: string;
  title: string;
  description: string;
  status: JobStatus;
  applicants: number;
  hasNewApplicants?: boolean;
  postedAt: string;
  deadline: string;
  location: string;
  jobType: string;
  salaryMin: number;
  salaryMax: number;
  skills: string[];
}

// Extended job interface with new salary format
export interface JobPost {
  id: string;
  title: string;
  description: string;
  status: JobStatus;
  employmentTypes: EmploymentType[];
  postedAt: string;
  expiryDate?: string;
  salary: JobSalary;
  location: string;
  skills: string[];
  applicantCount: number;
  hasNewApplicants?: boolean;
}

// Application status for filtering
export type ApplicationStatus = 'pending' | 'favorite' | 'archived' | 'hiring';

// Application filter tabs
export type ApplicationFilterTab =
  | 'all'
  | 'pending'
  | 'favorite'
  | 'archived'
  | 'hiring';

// Job application interface
export interface JobApplication {
  id: string;
  jobId: string;
  applicant: Applicant;
  coverLetter?: string;
  submittedAt: string;
  status: ApplicationStatus;
}

// Form input types
export interface JobFormData {
  title: string;
  description: string;
  employmentTypes: EmploymentType[];
  salary: JobSalary;
  location: string;
  skills: string[];
  expiryDate?: string;
}

// Employment type options with labels
export const EMPLOYMENT_TYPE_OPTIONS: {
  value: EmploymentType;
  label: string;
  group: 'working-hours' | 'position-type';
}[] = [
  { value: 'full-time', label: 'Full-time', group: 'working-hours' },
  { value: 'part-time', label: 'Part-time', group: 'working-hours' },
  { value: 'internship', label: 'Internship', group: 'position-type' },
  { value: 'contract', label: 'Contract', group: 'position-type' },
];

// Estimation type options
export const ESTIMATION_TYPE_OPTIONS: {
  value: EstimationType;
  label: string;
}[] = [
  { value: 'about', label: 'About' },
  { value: 'up-to', label: 'Up to' },
  { value: 'from', label: 'From' },
];

// Currency options
export const CURRENCY_OPTIONS = ['USD', 'VND', 'EUR', 'SGD'] as const;

// Application filter tab configuration
export interface ApplicationFilterTabConfig {
  id: ApplicationFilterTab;
  label: string;
  count: number;
}

// Helper to format salary for display
export function formatJobSalary(salary: JobSalary): string {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 0,
  });

  switch (salary.type) {
    case 'range':
      return `${formatter.format(salary.min)} - ${formatter.format(salary.max)} ${salary.currency}`;
    case 'estimation':
      const prefix =
        salary.estimationType === 'about'
          ? 'About'
          : salary.estimationType === 'up-to'
            ? 'Up to'
            : 'From';
      return `${prefix} ${formatter.format(salary.amount)} ${salary.currency}`;
    case 'negotiable':
      return 'Negotiable';
  }
}

// Helper to format employment types for display
export function formatEmploymentTypes(types: EmploymentType[]): string {
  return types
    .map((t) => {
      switch (t) {
        case 'full-time':
          return 'Full-time';
        case 'part-time':
          return 'Part-time';
        case 'internship':
          return 'Internship';
        case 'contract':
          return 'Contract';
      }
    })
    .join(', ');
}
