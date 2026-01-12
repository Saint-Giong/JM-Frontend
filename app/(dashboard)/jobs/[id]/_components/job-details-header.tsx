'use client';

import { Button } from '@saint-giong/bamboo-ui';
import { Eye, Pencil, Share2 } from 'lucide-react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/common/breadcrumb';
import type { JobPost } from '@/components/job/types';

interface JobDetailsHeaderProps {
  job: JobPost;
}

export function JobDetailsHeader({ job }: JobDetailsHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/jobs">Jobs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{job.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
