export type EducationDegree = 'bachelor' | 'master' | 'doctorate';

export type EmploymentType =
  | 'full-time'
  | 'part-time'
  | 'internship'
  | 'contract';

export type LocationType = 'city' | 'country';

export type ApplicantMark = 'favorite' | 'warning' | null;

export interface Education {
  degree: EducationDegree;
  field: string;
  institution: string;
  graduationYear: number;
}

export interface WorkExperience {
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

export interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  country: string;
  highestDegree: EducationDegree;
  education: Education[];
  workExperience: WorkExperience[];
  objectiveSummary: string;
  skills: string[];
  employmentTypes: EmploymentType[];
  mark: ApplicantMark;
  avatarUrl?: string;
}

export interface LocationFilter {
  type: LocationType;
  value: string;
}

export interface WorkExperienceFilter {
  type: 'none' | 'any' | 'keyword';
  value?: string;
}

export interface ApplicantSearchFilters {
  location?: LocationFilter;
  education: EducationDegree[];
  workExperience: WorkExperienceFilter;
  employmentTypes: EmploymentType[];
  skills: string[];
  fullTextSearch: string;
}

export const EDUCATION_OPTIONS: { value: EducationDegree; label: string }[] = [
  { value: 'bachelor', label: 'Bachelor' },
  { value: 'master', label: 'Master' },
  { value: 'doctorate', label: 'Doctorate' },
];

export const EMPLOYMENT_TYPE_OPTIONS: {
  value: EmploymentType;
  label: string;
}[] = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'internship', label: 'Internship' },
  { value: 'contract', label: 'Contract' },
];

export const COMMON_SKILLS = [
  'Python',
  'Java',
  'JavaScript',
  'TypeScript',
  'Go',
  'Rust',
  'React',
  'Angular',
  'Vue.js',
  'Spring Boot',
  'Django',
  'Node.js',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'Redis',
  'Docker',
  'Kubernetes',
  'Kafka',
  'Git',
  'AWS',
  'GCP',
  'Azure',
];
