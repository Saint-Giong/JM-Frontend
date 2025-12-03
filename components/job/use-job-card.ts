import { useMemo, useCallback } from 'react';

export type JobStatus = 'archived' | 'draft' | 'hiring' | 'published';

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
  currency: string;
  skills: string[];
}

export interface UseJobCardOptions {
  job: Job;
  onEdit?: (job: Job) => void;
  onMenuAction?: (action: string, job: Job) => void;
}

export interface JobCardStatus {
  value: JobStatus;
  label: string;
  isArchived: boolean;
  isDraft: boolean;
  isHiring: boolean;
  isPublished: boolean;
}

export interface JobCardApplicants {
  count: number;
  hasNew: boolean;
}

export interface JobCardSalary {
  min: number;
  max: number;
  currency: string;
  formatted: string;
}

export interface JobCardMeta {
  postedAt: string;
  deadline: string;
  location: string;
  jobType: string;
  salary: JobCardSalary;
}

export interface JobCardActions {
  edit: () => void;
  menuAction: (action: string) => void;
}

export interface JobCardReturn {
  // Raw data
  job: Job;

  // Computed state
  status: JobCardStatus;
  applicants: JobCardApplicants;
  meta: JobCardMeta;
  skills: string[];

  // Actions
  actions: JobCardActions;

  // Props getters for accessibility
  getRootProps: () => {
    'data-job-id': string;
    'data-status': JobStatus;
  };
  getTitleProps: () => {
    id: string;
  };
  getEditButtonProps: () => {
    type: 'button';
    'aria-label': string;
    onClick: () => void;
  };
  getMenuButtonProps: () => {
    type: 'button';
    'aria-label': string;
    'aria-haspopup': true;
    onClick: () => void;
  };
}

const STATUS_LABELS: Record<JobStatus, string> = {
  archived: 'Archived',
  draft: 'Draft',
  hiring: 'Hiring',
  published: 'Published',
};

function formatSalary(min: number, max: number, currency: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 0,
  });
  return `${formatter.format(min)} - ${formatter.format(max)} ${currency}`;
}

export function useJobCard(options: UseJobCardOptions): JobCardReturn {
  const { job, onEdit, onMenuAction } = options;

  // Computed: Status
  const status = useMemo<JobCardStatus>(
    () => ({
      value: job.status,
      label: STATUS_LABELS[job.status],
      isArchived: job.status === 'archived',
      isDraft: job.status === 'draft',
      isHiring: job.status === 'hiring',
      isPublished: job.status === 'published',
    }),
    [job.status]
  );

  // Computed: Applicants
  const applicants = useMemo<JobCardApplicants>(
    () => ({
      count: job.applicants,
      hasNew: job.hasNewApplicants ?? false,
    }),
    [job.applicants, job.hasNewApplicants]
  );

  // Computed: Meta
  const meta = useMemo<JobCardMeta>(
    () => ({
      postedAt: job.postedAt,
      deadline: job.deadline,
      location: job.location,
      jobType: job.jobType,
      salary: {
        min: job.salaryMin,
        max: job.salaryMax,
        currency: job.currency,
        formatted: formatSalary(job.salaryMin, job.salaryMax, job.currency),
      },
    }),
    [
      job.postedAt,
      job.deadline,
      job.location,
      job.jobType,
      job.salaryMin,
      job.salaryMax,
      job.currency,
    ]
  );

  // Actions
  const edit = useCallback(() => {
    onEdit?.(job);
  }, [job, onEdit]);

  const menuAction = useCallback(
    (action: string) => {
      onMenuAction?.(action, job);
    },
    [job, onMenuAction]
  );

  const actions = useMemo<JobCardActions>(
    () => ({ edit, menuAction }),
    [edit, menuAction]
  );

  // Props getters
  const getRootProps = useCallback(
    () => ({
      'data-job-id': job.id,
      'data-status': job.status,
    }),
    [job.id, job.status]
  );

  const getTitleProps = useCallback(
    () => ({
      id: `job-title-${job.id}`,
    }),
    [job.id]
  );

  const getEditButtonProps = useCallback(
    () => ({
      type: 'button' as const,
      'aria-label': `Edit ${job.title}`,
      onClick: edit,
    }),
    [job.title, edit]
  );

  const getMenuButtonProps = useCallback(
    () => ({
      type: 'button' as const,
      'aria-label': `More options for ${job.title}`,
      'aria-haspopup': true as const,
      onClick: () => menuAction('menu'),
    }),
    [job.title, menuAction]
  );

  return {
    job,
    status,
    applicants,
    meta,
    skills: job.skills,
    actions,
    getRootProps,
    getTitleProps,
    getEditButtonProps,
    getMenuButtonProps,
  };
}
