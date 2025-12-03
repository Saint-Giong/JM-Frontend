import { useMemo } from 'react';

export interface JobMetaInput {
  postedAt: string;
  deadline: string;
  location: string;
  jobType: string;
  salaryMin: number;
  salaryMax: number;
}

export interface JobSalary {
  min: number;
  max: number;
  formatted: string;
}

export interface JobMetaState {
  postedAt: string;
  deadline: string;
  location: string;
  jobType: string;
  salary: JobSalary;
}

function formatSalary(min: number, max: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 0,
  });
  return `${formatter.format(min)} - ${formatter.format(max)} USD`;
}

export function useJobMeta(input: JobMetaInput): JobMetaState {
  return useMemo(
    () => ({
      postedAt: input.postedAt,
      deadline: input.deadline,
      location: input.location,
      jobType: input.jobType,
      salary: {
        min: input.salaryMin,
        max: input.salaryMax,
        formatted: formatSalary(input.salaryMin, input.salaryMax),
      },
    }),
    [
      input.postedAt,
      input.deadline,
      input.location,
      input.jobType,
      input.salaryMin,
      input.salaryMax,
    ]
  );
}
