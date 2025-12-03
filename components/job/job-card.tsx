'use client';

import { Badge, Card } from '@saint-giong/bamboo-ui';
import {
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  MoreVertical,
  Pencil,
  Users,
  Wallet,
} from 'lucide-react';
import { JobBadge } from './job-badge';
import { type UseJobCardOptions, useJobCard } from './use-job-card';

export type { Job, JobStatus } from './use-job-card';

interface JobCardProps extends UseJobCardOptions {
  className?: string;
}

/**
 * JobCard - A styled UI component that consumes the headless useJobCard hook.
 *
 * This is an example implementation. You can create your own UI by using
 * the useJobCard hook directly and building custom markup.
 */
export function JobCard({
  job,
  onEdit,
  onMenuAction,
  className,
}: JobCardProps) {
  const {
    status,
    applicants,
    meta,
    skills,
    getRootProps,
    getTitleProps,
    getEditButtonProps,
    getMenuButtonProps,
  } = useJobCard({ job, onEdit, onMenuAction });

  return (
    <Card
      {...getRootProps()}
      className={`flex flex-col gap-4 p-5 transition-shadow hover:shadow-md ${className ?? ''}`}
    >
      {/* Header: Status, Applicants, Actions */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <JobBadge status={status.value} label={status.label} />
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Users className="h-4 w-4" />
            <span>{applicants.count}</span>
            {applicants.hasNew && (
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            {...getEditButtonProps()}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            {...getMenuButtonProps()}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content: Title and Description */}
      <div className="space-y-2">
        <h3
          {...getTitleProps()}
          className="font-semibold text-lg leading-tight"
        >
          {job.title}
        </h3>
        <p className="line-clamp-2 text-muted-foreground text-sm">
          {job.description}
        </p>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge key={skill} variant="outline" className="font-normal">
            {skill}
          </Badge>
        ))}
      </div>

      {/* Metadata */}
      <div className="flex flex-col gap-2 text-muted-foreground text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span>{meta.postedAt}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span>{meta.deadline}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span>{meta.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 flex-shrink-0" />
          <span>{meta.jobType}</span>
        </div>
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 flex-shrink-0" />
          <span>{meta.salary.formatted}</span>
        </div>
      </div>
    </Card>
  );
}

export { useJobCard } from './use-job-card';
