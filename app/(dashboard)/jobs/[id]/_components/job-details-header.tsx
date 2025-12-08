'use client';

import type { JobPost } from '@/components/job/types';
import { Button } from '@saint-giong/bamboo-ui';
import { ChevronRight, Eye, Pencil, Share2 } from 'lucide-react';
import Link from 'next/link';

interface JobDetailsHeaderProps {
  job: JobPost;
}

export function JobDetailsHeader({ job }: JobDetailsHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <div className="flex items-center gap-1">
        <Link href="/jobs" className="-translate-y-0.5 hover:underline">
          <span className="text-muted-foreground">Jobs</span>
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="-translate-y-0.5 font-medium">{job.title}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2">
          <Eye className="h-4 w-4" />
          View as Applicants
        </Button>
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Link href={`/jobs/${job.id}/edit`}>
          <Button className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>
    </header>
  );
}
