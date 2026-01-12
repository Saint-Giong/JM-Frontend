'use client';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@saint-giong/bamboo-ui';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JobForm, type JobFormData } from '@/components/job';
import { useJobPost } from '@/hooks/use-jobpost';
import { toCreateRequest } from '@/lib/api/jobpost';
import { useAuthStore } from '@/stores/auth';

export default function CreateJobPage() {
  const router = useRouter();
  const { companyId } = useAuthStore();
  const { createJob, isCreating, error, clearError } = useJobPost();

  const handleSubmit = async (data: JobFormData) => {
    if (!companyId) {
      console.error('No company ID available');
      return;
    }

    clearError();

    // Transform form data to API request format
    const request = toCreateRequest(data, companyId, true);

    const job = await createJob(request);

    if (job) {
      // Redirect to jobs list after successful creation
      router.push('/jobs');
    }
  };

  const handleCancel = () => {
    router.push('/jobs');
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-4 border-b px-6 py-4">
        <Link href="/jobs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-semibold text-2xl">Create Job Post</h1>
          <p className="text-muted-foreground text-sm">
            Fill in the details to create a new job posting
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
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                submitLabel="Create Job Post"
                isLoading={isCreating}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
