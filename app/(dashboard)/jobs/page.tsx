'use client';

import { type Job, JobCard } from '@/components/job/job-card';
import { useJobList } from '@/hooks/use-job-list';
import { useJobPost } from '@/hooks/use-jobpost';
import { toJob } from '@/lib/api/jobpost';
import { useAuthStore } from '@/stores/auth';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ToggleGroup,
  ToggleGroupItem,
} from '@saint-giong/bamboo-ui';
import { Grid, List, Loader2, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export default function JobsPage() {
  const router = useRouter();
  const { companyId } = useAuthStore();
  const { jobs: jobResponses, isLoading, error, fetchJobsByCompany } = useJobPost();

  // Transform API responses to frontend Job type
  const transformedJobs = useMemo(() => {
    return jobResponses.map(toJob);
  }, [jobResponses]);

  const {
    jobs,
    filterTabs,
    activeFilter,
    setActiveFilter,
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
  } = useJobList(transformedJobs);

  // Fetch jobs when component mounts or companyId changes
  useEffect(() => {
    if (companyId) {
      fetchJobsByCompany(companyId);
    }
  }, [companyId, fetchJobsByCompany]);

  const handleEdit = (job: Job) => {
    router.push(`/jobs/${job.id}/edit`);
  };

  const handleMenuAction = (action: string, job: Job) => {
    console.log('Menu action:', action, 'for job:', job.id);
  };

  const handleJobClick = (job: Job) => {
    router.push(`/jobs/${job.id}`);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex h-[4rem] items-center justify-between gap-4 border-border border-b px-6 py-4">
        <h1 className="font-semibold text-2xl">Jobs</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search job"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/jobs/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Post a Job
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Error State */}
        {error && (
          <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="mb-6 flex flex-col items-start justify-start gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {filterTabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeFilter === tab.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(tab.id)}
                className="rounded-full"
              >
                {tab.label} ({tab.count})
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={sortOption}
              onValueChange={(value) =>
                setSortOption(value as typeof sortOption)
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Sort</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="salary-high">Salary: High</SelectItem>
                <SelectItem value="salary-low">Salary: Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="h-6 w-px bg-border" />

            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) =>
                value && setViewMode(value as typeof viewMode)
              }
            >
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <Grid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : jobs.length === 0 ? (
          /* Empty State */
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <p className="text-muted-foreground">No jobs found</p>
            <Link href="/jobs/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create your first job post
              </Button>
            </Link>
          </div>
        ) : (
          /* Job Cards Grid/List */
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'flex flex-col gap-4'
            }
          >
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={handleEdit}
                onMenuAction={handleMenuAction}
                onClick={() => handleJobClick(job)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
