import { useMemo, useState } from 'react';
import type { Job, JobStatus } from '@/components/job/job-card-context';

export type FilterTab = 'all' | 'drafts' | 'published' | 'hiring' | 'archived';
export type SortOption = 'newest' | 'oldest' | 'salary-high' | 'salary-low';
export type ViewMode = 'grid' | 'list';

interface FilterConfig {
  id: FilterTab;
  label: string;
  statuses: JobStatus[] | null; // null means all
}

export const filterConfigs: FilterConfig[] = [
  { id: 'all', label: 'All', statuses: null },
  { id: 'drafts', label: 'Drafts', statuses: ['draft'] },
  { id: 'published', label: 'Published', statuses: ['published'] },
  { id: 'hiring', label: 'Hiring', statuses: ['hiring'] },
  { id: 'archived', label: 'Archived', statuses: ['archived'] },
];

interface UseJobListOptions {
  initialFilter?: FilterTab;
  initialSort?: SortOption;
  initialView?: ViewMode;
}

export function useJobList(jobs: Job[], options: UseJobListOptions = {}) {
  const {
    initialFilter = 'all',
    initialSort = 'newest',
    initialView = 'grid',
  } = options;

  const [activeFilter, setActiveFilter] = useState<FilterTab>(initialFilter);
  const [sortOption, setSortOption] = useState<SortOption>(initialSort);
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate counts for each filter
  const filterCounts = useMemo(() => {
    return filterConfigs.reduce(
      (acc, config) => {
        if (config.statuses === null) {
          acc[config.id] = jobs.length;
        } else {
          acc[config.id] = jobs.filter((job) =>
            config.statuses!.includes(job.status)
          ).length;
        }
        return acc;
      },
      {} as Record<FilterTab, number>
    );
  }, [jobs]);

  // Filter jobs based on active filter and search query
  const filteredJobs = useMemo(() => {
    const config = filterConfigs.find((c) => c.id === activeFilter);
    let result = jobs;

    // Apply status filter
    if (config?.statuses) {
      result = result.filter((job) => config.statuses!.includes(job.status));
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query) ||
          job.skills.some((s) => s.toLowerCase().includes(query)) ||
          job.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    return result;
  }, [jobs, activeFilter, searchQuery]);

  // Sort jobs
  const sortedJobs = useMemo(() => {
    const sorted = [...filteredJobs];

    switch (sortOption) {
      case 'newest':
        // Assuming newer jobs have higher IDs or we'd parse postedAt
        return sorted;
      case 'oldest':
        return sorted.reverse();
      case 'salary-high':
        return sorted.sort((a, b) => b.salaryMax - a.salaryMax);
      case 'salary-low':
        return sorted.sort((a, b) => a.salaryMin - b.salaryMin);
      default:
        return sorted;
    }
  }, [filteredJobs, sortOption]);

  // Filter tabs with counts
  const filterTabs = useMemo(() => {
    return filterConfigs.map((config) => ({
      id: config.id,
      label: config.label,
      count: filterCounts[config.id],
    }));
  }, [filterCounts]);

  return {
    // Data
    jobs: sortedJobs,
    filterTabs,
    totalCount: jobs.length,
    filteredCount: sortedJobs.length,

    // Filter state
    activeFilter,
    setActiveFilter,

    // Sort state
    sortOption,
    setSortOption,

    // View state
    viewMode,
    setViewMode,

    // Search state
    searchQuery,
    setSearchQuery,
  };
}

// Separate hook for just view mode (simpler use cases)
export function useViewMode(initialMode: ViewMode = 'grid') {
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);
  return { viewMode, setViewMode };
}

// Separate hook for just filtering
export function useJobFilter(initialFilter: FilterTab = 'all') {
  const [activeFilter, setActiveFilter] = useState<FilterTab>(initialFilter);
  return { activeFilter, setActiveFilter };
}

// Separate hook for just sorting
export function useJobSort(initialSort: SortOption = 'newest') {
  const [sortOption, setSortOption] = useState<SortOption>(initialSort);
  return { sortOption, setSortOption };
}
