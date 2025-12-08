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
      <div>
        <Link href="/jobs" className="hover:underline">
          <span className="text-muted-foreground">Jobs</span>
        </Link>
        <ChevronRight className="mx-3 inline size-4 text-muted-foreground" />
        <span className="font-medium">{job.title}</span>
      </div>

      <div className="flex gap-2">
        <Button variant="outline">
          <Eye className="size-4" />
          View as Applicants
        </Button>
        <Button variant="outline">
          <Share2 className="size-4" />
          Share
        </Button>
        <Link href={`/jobs/${job.id}/edit`}>
          <Button>
            <Pencil className="size-4" />
            Edit
          </Button>
        </Link>
      </div>
    </header>
  );
}
