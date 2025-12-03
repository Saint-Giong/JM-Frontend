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
import { type Job, JobCardProvider, type JobStatus } from './job-card-context';
import {
  JobCardApplicants,
  JobCardDescription,
  JobCardEditButton,
  JobCardMenuButton,
  JobCardMeta,
  JobCardRoot,
  JobCardSkills,
  JobCardStatus,
  JobCardTags,
  JobCardTitle,
} from './job-card-parts';

// Re-export types for convenience
export type { Job, JobStatus } from './job-card-context';

// Status styling configuration
const statusStyles: Record<JobStatus, string> = {
  archived: 'bg-zinc-800 text-white hover:bg-zinc-800',
  draft: 'bg-zinc-100 text-zinc-800 hover:bg-zinc-100',
  hiring: 'bg-lime-100 text-lime-800 hover:bg-lime-100',
  published: 'bg-lime-200 text-lime-900 hover:bg-lime-200',
};

interface JobCardProps {
  job: Job;
  onEdit?: (job: Job) => void;
  onMenuAction?: (action: string, job: Job) => void;
  className?: string;
}

// Default styled composition using headless parts
export function JobCard({
  job,
  onEdit,
  onMenuAction,
  className,
}: JobCardProps) {
  return (
    <JobCardProvider job={job} onEdit={onEdit} onMenuAction={onMenuAction}>
      <JobCardRoot>
        <Card
          className={`flex flex-col gap-4 p-5 transition-shadow hover:shadow-md ${className ?? ''}`}
        >
          {/* Header: Status, Applicants, Actions */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <JobCardStatus>
                {(status, label) => (
                  <Badge className={statusStyles[status]}>{label}</Badge>
                )}
              </JobCardStatus>
              <JobCardApplicants>
                {(count, hasNew) => (
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Users className="h-4 w-4" />
                    <span>{count}</span>
                    {hasNew && (
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    )}
                  </div>
                )}
              </JobCardApplicants>
            </div>
            <div className="flex items-center gap-1">
              <JobCardEditButton className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                <Pencil className="h-4 w-4" />
              </JobCardEditButton>
              <JobCardMenuButton className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                <MoreVertical className="h-4 w-4" />
              </JobCardMenuButton>
            </div>
          </div>

          {/* Content: Title and Description */}
          <div className="space-y-2">
            <JobCardTitle className="font-semibold text-lg leading-tight" />
            <JobCardDescription className="line-clamp-2 text-muted-foreground text-sm" />
          </div>

          {/* Tags: Skills and Tags */}
          <div className="flex flex-wrap gap-2">
            <JobCardSkills>
              {(skills) =>
                skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="font-normal">
                    {skill}
                  </Badge>
                ))
              }
            </JobCardSkills>
            <JobCardTags>
              {(tags) =>
                tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="font-normal">
                    {tag}
                  </Badge>
                ))
              }
            </JobCardTags>
          </div>

          {/* Metadata */}
          <JobCardMeta>
            {(meta) => (
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
            )}
          </JobCardMeta>
        </Card>
      </JobCardRoot>
    </JobCardProvider>
  );
}

// Export headless parts for custom compositions
export {
  JobCardRoot,
  JobCardStatus,
  JobCardApplicants,
  JobCardTitle,
  JobCardDescription,
  JobCardSkills,
  JobCardTags,
  JobCardMeta,
  JobCardEditButton,
  JobCardMenuButton,
} from './job-card-parts';
export {
  JobCardProvider,
  useJobCard,
  useJobCardContext,
} from './job-card-context';
