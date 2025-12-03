'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type ReactNode,
} from 'react';
import { type JobStatus, useJobCard } from './job-card-context';

// Status configuration - can be overridden via props
export const defaultStatusConfig: Record<JobStatus, { label: string }> = {
  archived: { label: 'Archived' },
  draft: { label: 'Draft' },
  hiring: { label: 'Hiring' },
  published: { label: 'Published' },
};

// Headless Root - just a div wrapper
export const JobCardRoot = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ children, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});
JobCardRoot.displayName = 'JobCardRoot';

// Headless Status - renders status via render prop or children
interface JobCardStatusProps {
  children?: (status: JobStatus, label: string) => ReactNode;
  statusLabels?: Record<JobStatus, string>;
}

export function JobCardStatus({ children, statusLabels }: JobCardStatusProps) {
  const { job } = useJobCard();
  const label =
    statusLabels?.[job.status] ?? defaultStatusConfig[job.status].label;

  if (children) {
    return <>{children(job.status, label)}</>;
  }

  return <span data-status={job.status}>{label}</span>;
}

// Headless Applicants - renders applicant count
interface JobCardApplicantsProps {
  children?: (count: number, hasNew: boolean) => ReactNode;
}

export function JobCardApplicants({ children }: JobCardApplicantsProps) {
  const { job } = useJobCard();
  const hasNew = job.hasNewApplicants ?? false;

  if (children) {
    return <>{children(job.applicants, hasNew)}</>;
  }

  return <span data-has-new={hasNew}>{job.applicants} applicants</span>;
}

// Headless Title
interface JobCardTitleProps extends ComponentPropsWithoutRef<'h3'> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p';
}

export const JobCardTitle = forwardRef<HTMLHeadingElement, JobCardTitleProps>(
  ({ as: Component = 'h3', children, ...props }, ref) => {
    const { job } = useJobCard();

    return (
      <Component ref={ref} {...props}>
        {children ?? job.title}
      </Component>
    );
  }
);
JobCardTitle.displayName = 'JobCardTitle';

// Headless Description
export const JobCardDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<'p'>
>(({ children, ...props }, ref) => {
  const { job } = useJobCard();

  return (
    <p ref={ref} {...props}>
      {children ?? job.description}
    </p>
  );
});
JobCardDescription.displayName = 'JobCardDescription';

// Headless Skills - renders skills via render prop
interface JobCardSkillsProps {
  children: (skills: string[]) => ReactNode;
}

export function JobCardSkills({ children }: JobCardSkillsProps) {
  const { job } = useJobCard();
  return <>{children(job.skills)}</>;
}

// Headless Tags - renders tags via render prop
interface JobCardTagsProps {
  children: (tags: string[]) => ReactNode;
}

export function JobCardTags({ children }: JobCardTagsProps) {
  const { job } = useJobCard();
  return <>{children(job.tags)}</>;
}

// Headless Meta - renders job metadata via render prop
interface JobMetadata {
  postedAt: string;
  deadline: string;
  location: string;
  jobType: string;
  salary: {
    min: number;
    max: number;
    currency: string;
    formatted: string;
  };
}

interface JobCardMetaProps {
  children: (meta: JobMetadata) => ReactNode;
}

export function JobCardMeta({ children }: JobCardMetaProps) {
  const { job } = useJobCard();

  const formatSalary = (min: number, max: number, currency: string) => {
    const formatter = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 0,
    });
    return `${formatter.format(min)} - ${formatter.format(max)} ${currency}`;
  };

  const meta: JobMetadata = {
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
  };

  return <>{children(meta)}</>;
}

// Headless Edit Button
interface JobCardEditButtonProps extends ComponentPropsWithoutRef<'button'> {
  children?: ReactNode;
}

export const JobCardEditButton = forwardRef<
  HTMLButtonElement,
  JobCardEditButtonProps
>(({ onClick, children, ...props }, ref) => {
  const { edit } = useJobCard();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    edit();
    onClick?.(e);
  };

  return (
    <button ref={ref} type="button" onClick={handleClick} {...props}>
      {children}
    </button>
  );
});
JobCardEditButton.displayName = 'JobCardEditButton';

// Headless Menu Button
interface JobCardMenuButtonProps extends ComponentPropsWithoutRef<'button'> {
  action?: string;
  children?: ReactNode;
}

export const JobCardMenuButton = forwardRef<
  HTMLButtonElement,
  JobCardMenuButtonProps
>(({ action = 'menu', onClick, children, ...props }, ref) => {
  const { menuAction } = useJobCard();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    menuAction(action);
    onClick?.(e);
  };

  return (
    <button ref={ref} type="button" onClick={handleClick} {...props}>
      {children}
    </button>
  );
});
JobCardMenuButton.displayName = 'JobCardMenuButton';

// Hook to access raw job data
export function useJobData() {
  const { job } = useJobCard();
  return job;
}
