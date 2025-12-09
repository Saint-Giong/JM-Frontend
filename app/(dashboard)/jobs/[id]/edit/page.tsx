'use client';

import { JobForm, type JobFormData } from '@/components/job';
import { getJobPostById } from '@/mocks';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@saint-giong/bamboo-ui';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get job data (in real app, this would be fetched from API)
  const jobPost = useMemo(() => getJobPostById(jobId), [jobId]);

  const initialData: Partial<JobFormData> | undefined = useMemo(() => {
    if (!jobPost) return undefined;
    return {
      title: jobPost.title,
      description: jobPost.description,
      employmentTypes: jobPost.employmentTypes,
      salary: jobPost.salary,
      location: jobPost.location,
      skills: jobPost.skills,
      expiryDate: jobPost.expiryDate,
    };
  }, [jobPost]);

  const handleSubmit = async (data: JobFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      console.log('Updating job:', jobId, data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to job details after successful update
      router.push(`/jobs/${jobId}`);
    } catch (error) {
      console.error('Failed to update job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/jobs/${jobId}`);
  };

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
                isLoading={isSubmitting}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
