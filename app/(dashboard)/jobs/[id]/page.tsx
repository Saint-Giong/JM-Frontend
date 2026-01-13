'use client';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@saint-giong/bamboo-ui';
import { Info, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { JobApplication } from '@/components/job/types';
import { useJobPost } from '@/hooks/use-jobpost';
import { toJobPost } from '@/lib/api/jobpost';
import { resolveSkillNames } from '@/lib/api/tag/tag.utils';
import { getApplicationCountsByStatus, getApplicationsForJob } from '@/mocks';
import { useAuthStore } from '@/stores/auth';
import { JobDetailsContent, JobDetailsHeader } from './_components';
import { JobApplicationsTab } from './_components/job-applications-tab';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [activeTab, setActiveTab] = useState('job-post');
  const { currentJob, isLoading, error, fetchJob } = useJobPost();
  const { companyId } = useAuthStore();

  const [resolvedSkills, setResolvedSkills] = useState<string[]>([]);

  // Fetch job data from API
  useEffect(() => {
    if (jobId) {
      fetchJob(jobId);
    }
  }, [jobId, fetchJob]);

  // Check ownership
  useEffect(() => {
    // Wait until both currentJob and companyId are available to avoid premature redirect
    if (
      !isLoading &&
      currentJob &&
      companyId &&
      currentJob.companyId !== companyId
    ) {
      // Redirect to jobs list if trying to access another company's job
      router.replace('/jobs');
    }
  }, [currentJob, companyId, router, isLoading]);

  // Resolve skill names when job data is loaded
  useEffect(() => {
    if (currentJob?.skillTagIds?.length) {
      resolveSkillNames(currentJob.skillTagIds).then(setResolvedSkills);
    }
  }, [currentJob]);

  // Transform API response to frontend JobPost type
  const jobPost = useMemo(() => {
    if (!currentJob) return null;
    const post = toJobPost(currentJob);
    // Override skills with resolved names if available
    if (resolvedSkills.length > 0) {
      post.skills = resolvedSkills;
    }
    return post;
  }, [currentJob, resolvedSkills]);

  // Get applications
  const mockApplications = useMemo(() => getApplicationsForJob(jobId), [jobId]);

  // TODO: Fetch real applications from API
  // Currently simulating empty real applications until API is ready
  const realApplications = useMemo<JobApplication[]>(() => [], []);

  const applications = useMemo(() => {
    return [...realApplications, ...mockApplications];
  }, [realApplications, mockApplications]);

  const applicationCounts = useMemo(() => {
    const all = applications.length;
    const pending = applications.filter((a) => a.status === 'pending').length;
    const favorite = applications.filter((a) => a.status === 'favorite').length;
    const archived = applications.filter((a) => a.status === 'archived').length;
    const hiring = applications.filter((a) => a.status === 'hiring').length;
    return { all, pending, favorite, archived, hiring };
  }, [applications]);

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

  // Not found state or unauthorized (will redirect)
  if (!jobPost || (companyId && currentJob?.companyId !== companyId)) {
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
  }, [jobId, fetchJob]);

  // Resolve skill names when job data is loaded
  useEffect(() => {
    if (currentJob?.skillTagIds?.length) {
      resolveSkillNames(currentJob.skillTagIds).then(setResolvedSkills);
    }
  }, [currentJob]);

  // Transform API response to frontend JobPost type
  const jobPost = useMemo(() => {
    if (!currentJob) return null;
    const post = toJobPost(currentJob);
    // Override skills with resolved names if available
    if (resolvedSkills.length > 0) {
      post.skills = resolvedSkills;
    }
    return post;
  }, [currentJob, resolvedSkills]);

  // Get applications
  const mockApplications = useMemo(() => getApplicationsForJob(jobId), [jobId]);

  // TODO: Fetch real applications from API
  // Currently simulating empty real applications until API is ready
  const realApplications = useMemo<JobApplication[]>(() => [], []);

  const applications = useMemo(() => {
    return [...realApplications, ...mockApplications];
  }, [realApplications, mockApplications]);

  const applicationCounts = useMemo(() => {
    const all = applications.length;
    const pending = applications.filter((a) => a.status === 'pending').length;
    const favorite = applications.filter((a) => a.status === 'favorite').length;
    const archived = applications.filter((a) => a.status === 'archived').length;
    const hiring = applications.filter((a) => a.status === 'hiring').length;
    return { all, pending, favorite, archived, hiring };
  }, [applications]);

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
          className="flex-1 flex-col overflow-hidden data-[state=active]:flex data-[state=inactive]:hidden"
        >
          <div className="p-4 pb-0">
            <Alert className="border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
              <Info className="h-4 w-4 text-blue-900 dark:text-blue-200" />
              <AlertTitle>Demo Data</AlertTitle>
              <AlertDescription>
                The job post details above are real, but the applicants listed
                below are mock data generated for demonstration purposes.
              </AlertDescription>
            </Alert>
          </div>
          <div className="flex-1 overflow-hidden">
            <JobApplicationsTab
              jobId={jobId}
              applications={applications}
              counts={applicationCounts}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
