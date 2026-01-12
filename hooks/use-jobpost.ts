'use client';

import { useCallback, useState } from 'react';
import type {
  CreateJobPostRequest,
  JobPostResponse,
  UpdateJobPostRequest,
} from '@/lib/api/jobpost';
import { jobPostApi } from '@/lib/api/jobpost';
import { HttpError } from '@/lib/http';

// Field-level error mapping
export type FieldErrors = Record<string, string>;

interface UseJobPostState {
  jobs: JobPostResponse[];
  currentJob: JobPostResponse | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  fieldErrors: FieldErrors;
}

interface UseJobPostReturn extends UseJobPostState {
  // CRUD operations
  fetchJobsByCompany: (companyId: string) => Promise<JobPostResponse[]>;
  fetchJob: (id: string) => Promise<JobPostResponse | null>;
  createJob: (data: CreateJobPostRequest) => Promise<JobPostResponse | null>;
  updateJob: (id: string, data: UpdateJobPostRequest) => Promise<boolean>;
  deleteJob: (id: string) => Promise<boolean>;

  // State management
  setJobs: (jobs: JobPostResponse[]) => void;
  setCurrentJob: (job: JobPostResponse | null) => void;
  clearError: () => void;
  clearFieldError: (field: string) => void;
  reset: () => void;
}

const initialState: UseJobPostState = {
  jobs: [],
  currentJob: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  fieldErrors: {},
};

/**
 * Hook for job post CRUD operations
 *
 * Provides a complete interface for managing job posts with
 * loading states, error handling, and automatic state management.
 *
 * @example
 * ```tsx
 * const {
 *   jobs,
 *   isLoading,
 *   fetchJobsByCompany,
 *   createJob,
 *   error
 * } = useJobPost();
 *
 * useEffect(() => {
 *   if (companyId) {
 *     fetchJobsByCompany(companyId);
 *   }
 * }, [companyId]);
 *
 * const handleCreate = async (data) => {
 *   const job = await createJob(data);
 *   if (job) {
 *     router.push(`/jobs/${job.id}`);
 *   }
 * };
 * ```
 */
export function useJobPost(): UseJobPostReturn {
  const [state, setState] = useState<UseJobPostState>(initialState);

  const setJobs = useCallback((jobs: JobPostResponse[]) => {
    setState((prev) => ({ ...prev, jobs }));
  }, []);

  const setCurrentJob = useCallback((currentJob: JobPostResponse | null) => {
    setState((prev) => ({ ...prev, currentJob }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, fieldErrors: {} }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setState((prev) => {
      const newFieldErrors = { ...prev.fieldErrors };
      delete newFieldErrors[field];
      return { ...prev, fieldErrors: newFieldErrors };
    });
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const handleError = useCallback(
    (err: unknown): { message: string; fieldErrors: FieldErrors } => {
      if (err instanceof HttpError) {
        const data = err.data as Record<string, unknown> | undefined;
        const fieldErrors: FieldErrors = {};

        // Check for validation errors with details
        if (data?.details && Array.isArray(data.details)) {
          const details = data.details as Array<{
            field?: string;
            issue?: string;
            value?: unknown;
          }>;

          // Extract field-level errors
          for (const d of details) {
            if (d.field && d.issue) {
              fieldErrors[d.field.toLowerCase()] = d.issue;
            }
          }

          if (Object.keys(fieldErrors).length > 0) {
            return {
              message:
                (data?.message as string) || 'Please fix the errors below',
              fieldErrors,
            };
          }
        }

        return {
          message:
            (data?.message as string) ?? err.statusText ?? 'An error occurred',
          fieldErrors: {},
        };
      }
      if (err instanceof Error) {
        return { message: err.message, fieldErrors: {} };
      }
      return { message: 'An unexpected error occurred', fieldErrors: {} };
    },
    []
  );

  const fetchJobsByCompany = useCallback(
    async (companyId: string): Promise<JobPostResponse[]> => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        fieldErrors: {},
      }));

      try {
        const jobs = await jobPostApi.getByCompany(companyId);
        setState((prev) => ({ ...prev, jobs, isLoading: false }));
        return jobs;
      } catch (err) {
        const { message, fieldErrors } = handleError(err);
        setState((prev) => ({
          ...prev,
          jobs: [],
          error: message,
          fieldErrors,
          isLoading: false,
        }));
        return [];
      }
    },
    [handleError]
  );

  const fetchJob = useCallback(
    async (id: string): Promise<JobPostResponse | null> => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        fieldErrors: {},
      }));

      try {
        const job = await jobPostApi.get(id);
        setState((prev) => ({ ...prev, currentJob: job, isLoading: false }));
        return job;
      } catch (err) {
        const { message, fieldErrors } = handleError(err);
        setState((prev) => ({
          ...prev,
          currentJob: null,
          error: message,
          fieldErrors,
          isLoading: false,
        }));
        return null;
      }
    },
    [handleError]
  );

  const createJob = useCallback(
    async (data: CreateJobPostRequest): Promise<JobPostResponse | null> => {
      setState((prev) => ({
        ...prev,
        isCreating: true,
        error: null,
        fieldErrors: {},
      }));

      try {
        const job = await jobPostApi.create(data);
        setState((prev) => ({
          ...prev,
          jobs: [...prev.jobs, job as JobPostResponse],
          currentJob: job as JobPostResponse,
          isCreating: false,
        }));
        return job as JobPostResponse;
      } catch (err) {
        const { message, fieldErrors } = handleError(err);
        setState((prev) => ({
          ...prev,
          error: message,
          fieldErrors,
          isCreating: false,
        }));
        return null;
      }
    },
    [handleError]
  );

  const updateJob = useCallback(
    async (id: string, data: UpdateJobPostRequest): Promise<boolean> => {
      setState((prev) => ({
        ...prev,
        isUpdating: true,
        error: null,
        fieldErrors: {},
      }));

      try {
        await jobPostApi.update(id, data);
        // Update the job in local state
        setState((prev) => ({
          ...prev,
          jobs: prev.jobs.map((job) =>
            job.id === id ? { ...job, ...data } : job
          ),
          currentJob:
            prev.currentJob?.id === id
              ? { ...prev.currentJob, ...data }
              : prev.currentJob,
          isUpdating: false,
        }));
        return true;
      } catch (err) {
        const { message, fieldErrors } = handleError(err);
        setState((prev) => ({
          ...prev,
          error: message,
          fieldErrors,
          isUpdating: false,
        }));
        return false;
      }
    },
    [handleError]
  );

  const deleteJob = useCallback(
    async (id: string): Promise<boolean> => {
      setState((prev) => ({
        ...prev,
        isDeleting: true,
        error: null,
        fieldErrors: {},
      }));

      try {
        await jobPostApi.delete(id);
        setState((prev) => ({
          ...prev,
          jobs: prev.jobs.filter((job) => job.id !== id),
          currentJob: prev.currentJob?.id === id ? null : prev.currentJob,
          isDeleting: false,
        }));
        return true;
      } catch (err) {
        const { message, fieldErrors } = handleError(err);
        setState((prev) => ({
          ...prev,
          error: message,
          fieldErrors,
          isDeleting: false,
        }));
        return false;
      }
    },
    [handleError]
  );

  return {
    ...state,
    fetchJobsByCompany,
    fetchJob,
    createJob,
    updateJob,
    deleteJob,
    setJobs,
    setCurrentJob,
    clearError,
    clearFieldError,
    reset,
  };
}
