'use client';

import { Button } from '@saint-giong/bamboo-ui';
import { ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { JobCard } from '@/components/job';
import type { Job } from './types';

interface JobPostsSectionProps {
  jobPosts: Job[];
}

export function JobPostsSection({ jobPosts }: JobPostsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2 hover:opacity-70"
        >
          <h3 className="section-heading">
            Job Posts{' '}
            <span className="font-normal text-base text-muted-foreground">
              ({jobPosts.length})
            </span>
          </h3>
          <ChevronRight className="h-5 w-5" />
        </button>
        <Link href="/jobs/new">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Job
          </Button>
        </Link>
      </div>
      <div className="relative">
        <div className="scrollbar-hide grid grid-cols-1 gap-4 overflow-x-auto sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex gap-4 pb-4">
            {jobPosts.slice(0, 8).map((job) => (
              <JobCard key={job.id} job={job} className="w-80 flex-shrink-0" />
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
    </div>
  );
}
