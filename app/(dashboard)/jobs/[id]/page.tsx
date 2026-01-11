'use client';

import { useJobPost } from '@/hooks/use-jobpost';
import { toJobPost } from '@/lib/api/jobpost';
import { getApplicationCountsByStatus, getApplicationsForJob } from '@/mocks';
import {
  Button,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@saint-giong/bamboo-ui';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { JobDetailsContent, JobDetailsHeader } from './_components';
import { JobApplicationsTab } from './_components/job-applications-tab';

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [activeTab, setActiveTab] = useState('job-post');
  const { currentJob, isLoading, error, fetchJob } = useJobPost();

  // Fetch job data from API
  useEffect(() => {
    if (jobId) {
      fetchJob(jobId);
    }
  }, [jobId, fetchJob]);

  // Transform API response to frontend JobPost type
  const jobPost = useMemo(() => {
    return currentJob ? toJobPost(currentJob) : null;
  }, [currentJob]);

  // Get applications (still using mock for now - applications service integration would be separate)
  const applications = useMemo(() => getApplicationsForJob(jobId), [jobId]);
  const applicationCounts = useMemo(
    () => getApplicationCountsByStatus(jobId),
    [jobId]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Loading job details...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="font-semibold text-2xl">Error loading job</h1>
        <p className="text-muted-foreground">{error}</p>
        <Link href="/jobs">
          <Button>Back to Jobs</Button>
        </Link>
      </div>
    );
  }

  // Not found state
  if (!jobPost) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="font-semibold text-2xl">Job not found</h1>
        <p className="text-muted-foreground">
          The job post you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/jobs">
          <Button>Back to Jobs</Button>
        </Link>
      </div>
    );
  }

  const hasNewApplicants = jobPost.hasNewApplicants;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden md:h-screen">
      <JobDetailsHeader job={jobPost} />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <div className="border-b">
          <TabsList className="h-12 w-full justify-start bg-transparent p-0">
            <TabsTrigger
              value="job-post"
              className="w-full rounded-none border-0"
            >
              JOB POST
            </TabsTrigger>
            <Separator orientation="vertical" />
            <TabsTrigger
              value="applicants"
              className="w-full rounded-none border-0"
            >
              <span className="flex items-center gap-2">
                APPLICANTS ({applicationCounts.all})
                {hasNewApplicants && (
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                )}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="job-post"
          className="flex-1 overflow-y-auto data-[state=inactive]:hidden"
        >
          <JobDetailsContent job={jobPost} />
        </TabsContent>

        <TabsContent
          value="applicants"
          className="flex-1 overflow-hidden data-[state=inactive]:hidden"
        >
          <JobApplicationsTab
            jobId={jobId}
            applications={applications}
            counts={applicationCounts}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
