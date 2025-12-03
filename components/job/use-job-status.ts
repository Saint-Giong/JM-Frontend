import { useMemo } from 'react';

export type JobStatus = 'archived' | 'draft' | 'hiring' | 'published';

export interface JobStatusState {
  value: JobStatus;
  label: string;
  isArchived: boolean;
  isDraft: boolean;
  isHiring: boolean;
  isPublished: boolean;
}

const STATUS_LABELS: Record<JobStatus, string> = {
  archived: 'Archived',
  draft: 'Draft',
  hiring: 'Hiring',
  published: 'Published',
};

export function useJobStatus(status: JobStatus): JobStatusState {
  return useMemo(
    () => ({
      value: status,
      label: STATUS_LABELS[status],
      isArchived: status === 'archived',
      isDraft: status === 'draft',
      isHiring: status === 'hiring',
      isPublished: status === 'published',
    }),
    [status]
  );
}
