import { useMemo, useCallback } from 'react';
import {
  useJobStatus,
  type JobStatus,
  type JobStatusState,
} from './use-job-status';
import { useJobMeta, type JobMetaState } from './use-job-meta';

// Re-export types
export type { JobStatus, JobStatusState } from './use-job-status';
export type { JobMetaState, JobSalary } from './use-job-meta';

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

export interface UseJobCardOptions {
  job: Job;
  onEdit?: (job: Job) => void;
  onMenuAction?: (action: string, job: Job) => void;
}

export interface JobCardApplicants {
  count: number;
  hasNew: boolean;
}

export interface JobCardActions {
  edit: () => void;
  menuAction: (action: string) => void;
}

export interface JobCardReturn {
  job: Job;
  status: JobStatusState;
  applicants: JobCardApplicants;
  meta: JobMetaState;
  skills: string[];
  actions: JobCardActions;
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

export function useJobCard(options: UseJobCardOptions): JobCardReturn {
  const { job, onEdit, onMenuAction } = options;

  // Compose smaller hooks
  const status = useJobStatus(job.status);

  const meta = useJobMeta({
    postedAt: job.postedAt,
    deadline: job.deadline,
    location: job.location,
    jobType: job.jobType,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
  });

  // Computed: Applicants
  const applicants = useMemo<JobCardApplicants>(
    () => ({
      count: job.applicants,
      hasNew: job.hasNewApplicants ?? false,
    }),
    [job.applicants, job.hasNewApplicants]
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
