import { Badge } from '@saint-giong/bamboo-ui';
import type { JobStatus } from './use-job-card';

export type { JobStatus } from './use-job-card';

const STATUS_STYLES: Record<JobStatus, string> = {
  archived: 'bg-zinc-800 text-white hover:bg-zinc-800',
  draft: 'bg-zinc-100 text-zinc-800 hover:bg-zinc-100',
  hiring: 'bg-lime-100 text-lime-800 hover:bg-lime-100',
  published: 'bg-lime-200 text-lime-900 hover:bg-lime-200',
};

interface JobBadgeProps {
  status: JobStatus;
  label: string;
  className?: string;
}

export function JobBadge({ status, label, className }: JobBadgeProps) {
  return (
    <Badge className={`${STATUS_STYLES[status]} ${className ?? ''}`}>
      {label}
    </Badge>
  );
}
