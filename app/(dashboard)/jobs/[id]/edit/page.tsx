'use client';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@saint-giong/bamboo-ui';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { JobForm, type JobFormData } from '@/components/job';
import { useJobPost } from '@/hooks/use-jobpost';
import { toFormData, toUpdateRequest } from '@/lib/api/jobpost';
import { useAuthStore } from '@/stores/auth';

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const { companyId } = useAuthStore();
  const {
    currentJob,
    isLoading,
    isUpdating,
    error,
    fetchJob,
    updateJob,
    clearError,
  } = useJobPost();

  // Fetch job data from API
  useEffect(() => {
    if (jobId) {
      fetchJob(jobId);
    }
  }, [jobId, fetchJob]);

  // Transform API response to form data
  const initialData = useMemo(() => {
    return currentJob ? toFormData(currentJob) : undefined;
  }, [currentJob]);

  const handleSubmit = async (data: JobFormData) => {
    if (!companyId) {
      console.error('No company ID available');
      return;
    }

    clearError();

    // Transform form data to API request format
    // Preserve the published status from the current job
    const isPublished = currentJob?.published ?? false;
    const request = toUpdateRequest(data, companyId, isPublished);

    const success = await updateJob(jobId, request);

    if (success) {
      // Redirect to job details after successful update
      router.push(`/jobs/${jobId}`);
    }
  };

  const handleCancel = () => {
    router.push(`/jobs/${jobId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Loading job details...</p>
      </div>
    );
  }

  // Not found state
  if (!currentJob && !isLoading) {
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

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-4 border-b px-6 py-4">
        <Link href={`/jobs/${jobId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-semibold text-2xl">Edit Job Post</h1>
          <p className="text-muted-foreground text-sm">
            Update the details of your job posting
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl">
          {/* Error Display */}
          {error && (
            <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <JobForm
                initialData={initialData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                submitLabel="Save Changes"
                isLoading={isUpdating}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
