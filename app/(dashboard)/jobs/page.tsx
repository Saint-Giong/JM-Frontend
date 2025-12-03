'use client';

import { JobCard, type Job } from '@/components/job/job-card';
import { useJobList } from '@/hooks/use-job-list';
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
import { Grid, List, Plus, Search } from 'lucide-react';

// Mock data - would come from API in production
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Social Media Manager',
    description:
      'Lorem ipsum dolor sit amet consectetur. Felis diam pellentesque...',
    status: 'archived',
    applicants: 10,
    hasNewApplicants: true,
    postedAt: 'A day ago',
    deadline: '01 November 2026',
    location: 'Ho Chi Minh City, Vietnam',
    jobType: 'Full-time',
    salaryMin: 30000,
    salaryMax: 80000,
    currency: 'USD',
    skills: ['Skill'],
    tags: ['Tag'],
  },
  {
    id: '2',
    title: 'Social Media Manager',
    description:
      'Lorem ipsum dolor sit amet consectetur. Felis diam pellentesque...',
    status: 'draft',
    applicants: 10,
    hasNewApplicants: true,
    postedAt: 'A day ago',
    deadline: '01 November 2026',
    location: 'Ho Chi Minh City, Vietnam',
    jobType: 'Full-time',
    salaryMin: 30000,
    salaryMax: 80000,
    currency: 'USD',
    skills: ['Skill'],
    tags: ['Tag'],
  },
  {
    id: '3',
    title: 'Social Media Manager',
    description:
      'Lorem ipsum dolor sit amet consectetur. Felis diam pellentesque...',
    status: 'hiring',
    applicants: 10,
    hasNewApplicants: true,
    postedAt: 'A day ago',
    deadline: '01 November 2026',
    location: 'Ho Chi Minh City, Vietnam',
    jobType: 'Full-time',
    salaryMin: 30000,
    salaryMax: 80000,
    currency: 'USD',
    skills: ['Skill'],
    tags: ['Tag'],
  },
  {
    id: '4',
    title: 'Social Media Manager',
    description:
      'Lorem ipsum dolor sit amet consectetur. Felis diam pellentesque...',
    status: 'published',
    applicants: 10,
    hasNewApplicants: true,
    postedAt: 'A day ago',
    deadline: '01 November 2026',
    location: 'Ho Chi Minh City, Vietnam',
    jobType: 'Full-time',
    salaryMin: 30000,
    salaryMax: 80000,
    currency: 'USD',
    skills: ['Skill'],
    tags: ['Tag'],
  },
  {
    id: '5',
    title: 'Social Media Manager',
    description:
      'Lorem ipsum dolor sit amet consectetur. Felis diam pellentesque...',
    status: 'archived',
    applicants: 10,
    hasNewApplicants: true,
    postedAt: 'A day ago',
    deadline: '01 November 2026',
    location: 'Ho Chi Minh City, Vietnam',
    jobType: 'Full-time',
    salaryMin: 30000,
    salaryMax: 80000,
    currency: 'USD',
    skills: ['Skill'],
    tags: ['Tag'],
  },
  {
    id: '6',
    title: 'Social Media Manager',
    description:
      'Lorem ipsum dolor sit amet consectetur. Felis diam pellentesque...',
    status: 'draft',
    applicants: 10,
    hasNewApplicants: true,
    postedAt: 'A day ago',
    deadline: '01 November 2026',
    location: 'Ho Chi Minh City, Vietnam',
    jobType: 'Full-time',
    salaryMin: 30000,
    salaryMax: 80000,
    currency: 'USD',
    skills: ['Skill'],
    tags: ['Tag'],
  },
  {
    id: '7',
    title: 'Social Media Manager',
    description:
      'Lorem ipsum dolor sit amet consectetur. Felis diam pellentesque...',
    status: 'hiring',
    applicants: 10,
    hasNewApplicants: true,
    postedAt: 'A day ago',
    deadline: '01 November 2026',
    location: 'Ho Chi Minh City, Vietnam',
    jobType: 'Full-time',
    salaryMin: 30000,
    salaryMax: 80000,
    currency: 'USD',
    skills: ['Skill'],
    tags: ['Tag'],
  },
  {
    id: '8',
    title: 'Social Media Manager',
    description:
      'Lorem ipsum dolor sit amet consectetur. Felis diam pellentesque...',
    status: 'published',
    applicants: 10,
    hasNewApplicants: true,
    postedAt: 'A day ago',
    deadline: '01 November 2026',
    location: 'Ho Chi Minh City, Vietnam',
    jobType: 'Full-time',
    salaryMin: 30000,
    salaryMax: 80000,
    currency: 'USD',
    skills: ['Skill'],
    tags: ['Tag'],
  },
];

export default function JobsPage() {
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
  } = useJobList(mockJobs);

  const handleEdit = (job: Job) => {
    console.log('Edit job:', job.id);
  };

  const handleMenuAction = (action: string, job: Job) => {
    console.log('Menu action:', action, 'for job:', job.id);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-2xl font-semibold">Jobs</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search job"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Post a Job
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Filters and Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
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

        {/* Job Cards Grid/List */}
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'flex flex-col gap-4'
          }
        >
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={handleEdit}
              onMenuAction={handleMenuAction}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
