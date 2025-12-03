'use client';

import { create } from 'zustand';

export type JobStatus = 'archived' | 'draft' | 'hiring' | 'published';

export interface Job {
  id: string;
  title: string;
  description: string;
  status: JobStatus;
  applicants: number;
  hasNewApplicants?: boolean;
  postedAt: string;
  deadline: string;
  location: string;
  jobType: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  skills: string[];
  tags: string[];
}

interface JobCardState {
  job: Job | null;
  onEdit: ((job: Job) => void) | null;
  onMenuAction: ((action: string, job: Job) => void) | null;
}

interface JobCardActions {
  setJob: (job: Job) => void;
  setOnEdit: (handler: ((job: Job) => void) | undefined) => void;
  setOnMenuAction: (
    handler: ((action: string, job: Job) => void) | undefined
  ) => void;
  edit: () => void;
  menuAction: (action: string) => void;
}

export type JobCardStore = JobCardState & JobCardActions;

export const createJobCardStore = (
  initialJob: Job,
  onEdit?: (job: Job) => void,
  onMenuAction?: (action: string, job: Job) => void
) =>
  create<JobCardStore>((set, get) => ({
    job: initialJob,
    onEdit: onEdit ?? null,
    onMenuAction: onMenuAction ?? null,

    setJob: (job) => set({ job }),
    setOnEdit: (handler) => set({ onEdit: handler ?? null }),
    setOnMenuAction: (handler) => set({ onMenuAction: handler ?? null }),

    edit: () => {
      const { job, onEdit } = get();
      if (job && onEdit) {
        onEdit(job);
      }
    },

    menuAction: (action) => {
      const { job, onMenuAction } = get();
      if (job && onMenuAction) {
        onMenuAction(action, job);
      }
    },
  }));

// Type for the store hook
export type UseJobCardStore = ReturnType<typeof createJobCardStore>;
