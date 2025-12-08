'use client';

import type {
  ApplicationFilterTab,
  ApplicationStatus,
  JobApplication,
} from '@/components/job/types';
import { useState, useMemo, useCallback } from 'react';

interface UseJobApplicationsOptions {
  pageSize?: number;
}

interface ApplicationCounts {
  all: number;
  pending: number;
  favorite: number;
  archived: number;
  hiring: number;
}

export interface UseJobApplicationsReturn {
  // Data
  applications: JobApplication[];
  filteredApplications: JobApplication[];
  totalCount: number;

  // Filters
  activeFilter: ApplicationFilterTab;
  setActiveFilter: (filter: ApplicationFilterTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Selection
  selectedApplication: JobApplication | null;
  setSelectedApplication: (application: JobApplication | null) => void;

  // Actions
  updateApplicationStatus: (
    applicationId: string,
    status: ApplicationStatus
  ) => void;

  // Counts
  counts: ApplicationCounts;

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  paginatedApplications: JobApplication[];
}

export function useJobApplications(
  initialApplications: JobApplication[],
  options: UseJobApplicationsOptions = {}
): UseJobApplicationsReturn {
  const { pageSize = 10 } = options;

  // State
  const [applications, setApplications] =
    useState<JobApplication[]>(initialApplications);
  const [activeFilter, setActiveFilter] = useState<ApplicationFilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplication | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Compute counts
  const counts = useMemo<ApplicationCounts>(() => {
    return {
      all: applications.length,
      pending: applications.filter((a) => a.status === 'pending').length,
      favorite: applications.filter((a) => a.status === 'favorite').length,
      archived: applications.filter((a) => a.status === 'archived').length,
      hiring: applications.filter((a) => a.status === 'hiring').length,
    };
  }, [applications]);

  // Filter applications
  const filteredApplications = useMemo(() => {
    let result = applications;

    // Filter by status tab
    if (activeFilter !== 'all') {
      result = result.filter((app) => app.status === activeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((app) => {
        const { applicant } = app;
        const fullName =
          `${applicant.firstName} ${applicant.lastName}`.toLowerCase();
        const skills = applicant.skills.join(' ').toLowerCase();
        const email = applicant.email.toLowerCase();

        return (
          fullName.includes(query) ||
          skills.includes(query) ||
          email.includes(query) ||
          app.coverLetter?.toLowerCase().includes(query)
        );
      });
    }

    return result;
  }, [applications, activeFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / pageSize);
  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredApplications.slice(start, start + pageSize);
  }, [filteredApplications, currentPage, pageSize]);

  // Reset page when filter changes
  const handleSetActiveFilter = useCallback((filter: ApplicationFilterTab) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  }, []);

  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  // Update application status
  const updateApplicationStatus = useCallback(
    (applicationId: string, status: ApplicationStatus) => {
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status } : app))
      );

      // Update selected application if it's the one being changed
      setSelectedApplication((prev) => {
        if (prev?.id === applicationId) {
          return { ...prev, status };
        }
        return prev;
      });
    },
    []
  );

  return {
    applications,
    filteredApplications,
    totalCount: filteredApplications.length,
    activeFilter,
    setActiveFilter: handleSetActiveFilter,
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    selectedApplication,
    setSelectedApplication,
    updateApplicationStatus,
    counts,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedApplications,
  };
}
