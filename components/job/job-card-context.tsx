'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useStore } from 'zustand';
import {
  createJobCardStore,
  type Job,
  type JobCardStore,
  type UseJobCardStore,
} from './job-card-store';

// Re-export types
export type { Job, JobStatus, JobCardStore } from './job-card-store';

// Context to provide the store instance
const JobCardStoreContext = createContext<UseJobCardStore | null>(null);

// Hook to access the store
export function useJobCardStore<T>(selector: (state: JobCardStore) => T): T {
  const store = useContext(JobCardStoreContext);
  if (!store) {
    throw new Error('useJobCardStore must be used within a JobCardProvider');
  }
  return useStore(store, selector);
}

// Convenience hook to get the full store
export function useJobCard() {
  const job = useJobCardStore((state) => state.job);
  const edit = useJobCardStore((state) => state.edit);
  const menuAction = useJobCardStore((state) => state.menuAction);

  if (!job) {
    throw new Error('Job not initialized in store');
  }

  return { job, edit, menuAction };
}

// Optional hook that returns null if not in provider
// Note: Uses getState() instead of useStore to safely handle missing provider
// This means the component won't re-render on state changes
export function useJobCardContext() {
  const store = useContext(JobCardStoreContext);

  if (!store) return null;

  const state = store.getState();
  const { job, edit, menuAction } = state;

  if (!job) return null;

  return { job, edit, menuAction };
}

interface JobCardProviderProps {
  job: Job;
  onEdit?: (job: Job) => void;
  onMenuAction?: (action: string, job: Job) => void;
  children: ReactNode;
}

export function JobCardProvider({
  job,
  onEdit,
  onMenuAction,
  children,
}: JobCardProviderProps) {
  const storeRef = useRef<UseJobCardStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createJobCardStore(job, onEdit, onMenuAction);
  }

  return (
    <JobCardStoreContext.Provider value={storeRef.current}>
      {children}
    </JobCardStoreContext.Provider>
  );
}
