import type { EducationDegree } from '@/components/applicant/types';

export const DEGREE_LABELS: Record<EducationDegree, string> = {
  bachelor: 'Bachelor',
  master: 'Master',
  doctorate: 'Doctorate',
};

export const EDUCATION_OPTIONS: { value: EducationDegree; label: string }[] = [
  { value: 'bachelor', label: 'Bachelor' },
  { value: 'master', label: 'Master' },
  { value: 'doctorate', label: 'Doctorate' },
];
