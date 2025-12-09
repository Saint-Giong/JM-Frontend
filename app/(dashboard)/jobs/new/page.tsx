'use client';

import { JobForm, type JobFormData } from '@/components/job';
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
import { useState } from 'react';

export default function CreateJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: JobFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      console.log('Creating job:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to jobs list after successful creation
      router.push('/jobs');
    } catch (error) {
      console.error('Failed to create job:', error);
    } finally {
      setIsSubmitting(false);
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
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <JobForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                submitLabel="Create Job Post"
                isLoading={isSubmitting}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
