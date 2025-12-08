'use client';

import type {
  ApplicationFilterTab,
  ApplicationStatus,
  JobApplication,
} from '@/components/job/types';
import { useJobApplications } from '@/hooks/use-job-applications';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@saint-giong/bamboo-ui';
import { Search, SlidersHorizontal, Users, X } from 'lucide-react';
import { useState } from 'react';
import { ApplicationCard } from './application-card';
import { ApplicationDetailPanel } from './application-detail-panel';

interface JobApplicationsTabProps {
  jobId: string;
  applications: JobApplication[];
  counts: Record<ApplicationStatus | 'all', number>;
}

const FILTER_OPTIONS: { id: ApplicationFilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'favorite', label: 'Favorite' },
  { id: 'archived', label: 'Archived' },
  { id: 'hiring', label: 'Hiring' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
];

export function JobApplicationsTab({ applications }: JobApplicationsTabProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const {
    paginatedApplications,
    activeFilter,
    setActiveFilter,
    selectedApplication,
    setSelectedApplication,
    updateApplicationStatus,
    counts,
  } = useJobApplications(applications);

  const handleStatusChange = (
    applicationId: string,
    status: ApplicationStatus
  ) => {
    updateApplicationStatus(applicationId, status);
  };

  // Filter by search query
  const filteredApplications = paginatedApplications.filter((app) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const fullName =
      `${app.applicant.firstName} ${app.applicant.lastName}`.toLowerCase();
    return (
      fullName.includes(query) ||
      app.applicant.email.toLowerCase().includes(query) ||
      app.applicant.skills.some((s) => s.toLowerCase().includes(query))
    );
  });

  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === 'newest') {
      return (
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
    }
    return (
      new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
    );
  });

  // Build filter summary
  const filterChips: { label: string; onRemove?: () => void }[] = [];
  if (activeFilter !== 'all') {
    const label =
      FILTER_OPTIONS.find((o) => o.id === activeFilter)?.label || activeFilter;
    filterChips.push({
      label: `Status: ${label}`,
      onRemove: () => setActiveFilter('all'),
    });
  }
  if (sortBy !== 'newest') {
    filterChips.push({
      label: 'Oldest first',
      onRemove: () => setSortBy('newest'),
    });
  }

  const hasActiveFilters = filterChips.length > 0;

  const clearAllFilters = () => {
    setActiveFilter('all');
    setSortBy('newest');
    setSearchQuery('');
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="flex h-full flex-col overflow-hidden lg:hidden">
        <div className="overflow-y-auto">
          {/* Search and Filters */}
          <div className="border-b px-4 py-3">
            <div className="flex gap-2">
              <Input
                placeholder="Search applicants..."
                className="flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="shrink-0 gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    {hasActiveFilters && (
                      <Badge
                        variant="secondary"
                        className="h-5 w-5 rounded-full p-0 text-xs"
                      >
                        {filterChips.length}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Filter Applications</DialogTitle>
                  </DialogHeader>
                  <FilterDialogContent
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    counts={counts}
                    onApply={() => setDialogOpen(false)}
                    onClear={clearAllFilters}
                    hasActiveFilters={hasActiveFilters}
                  />
                </DialogContent>
              </Dialog>

              <Button
                onClick={() => {}}
                size="icon"
                className="shrink-0 sm:hidden"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-muted-foreground text-xs">Active:</span>
                {filterChips.map((chip, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="gap-1 py-0.5 text-xs"
                  >
                    {chip.label}
                    {chip.onRemove && (
                      <button
                        type="button"
                        onClick={chip.onRemove}
                        className="ml-0.5 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-muted-foreground text-xs hover:text-foreground"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="p-3 sm:p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Applications</h2>
              <span className="text-muted-foreground text-sm">
                {sortedApplications.length} result
                {sortedApplications.length !== 1 ? 's' : ''}
              </span>
            </div>

            {sortedApplications.length === 0 ? (
              <EmptyState activeFilter={activeFilter} />
            ) : (
              <div className="space-y-3">
                {sortedApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onClick={() => setSelectedApplication(application)}
                    onStatusChange={(status) =>
                      handleStatusChange(application.id, status)
                    }
                    isSelected={selectedApplication?.id === application.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden h-full flex-col overflow-hidden lg:flex">
        {/* Search and Filters */}
        <div className="border-b px-4 py-3 sm:px-6">
          <div className="flex gap-2">
            <Input
              placeholder="Search applicants..."
              className="max-w-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="shrink-0 gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
                    >
                      {filterChips.length}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Filter Applications</DialogTitle>
                </DialogHeader>
                <FilterDialogContent
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  counts={counts}
                  onApply={() => setDialogOpen(false)}
                  onClear={clearAllFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-muted-foreground text-xs">Active:</span>
              {filterChips.map((chip, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="gap-1 py-0.5 text-xs"
                >
                  {chip.label}
                  {chip.onRemove && (
                    <button
                      type="button"
                      onClick={chip.onRemove}
                      className="ml-0.5 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-muted-foreground text-xs hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Split view */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Applications List */}
          <div
            className={`flex flex-col overflow-hidden ${selectedApplication ? 'w-1/2 border-r' : 'w-full'}`}
          >
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">Applications</h2>
                <span className="text-muted-foreground text-sm">
                  {sortedApplications.length} result
                  {sortedApplications.length !== 1 ? 's' : ''}
                </span>
              </div>

              {sortedApplications.length === 0 ? (
                <EmptyState activeFilter={activeFilter} />
              ) : (
                <div className="space-y-3">
                  {sortedApplications.map((application) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      onClick={() => setSelectedApplication(application)}
                      onStatusChange={(status) =>
                        handleStatusChange(application.id, status)
                      }
                      isSelected={selectedApplication?.id === application.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop: Side Panel */}
          {selectedApplication && (
            <aside className="w-1/2 overflow-y-auto">
              <ApplicationDetailPanel
                application={selectedApplication}
                onClose={() => setSelectedApplication(null)}
                onStatusChange={handleStatusChange}
              />
            </aside>
          )}
        </div>
      </div>

      {/* Mobile/Tablet: Sheet */}
      <Sheet
        open={!!selectedApplication && !isDesktop}
        onOpenChange={(open) => !open && setSelectedApplication(null)}
      >
        <SheetContent
          side="right"
          className="flex h-full w-full flex-col overflow-hidden p-0 sm:max-w-lg"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Application Details</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <ApplicationDetailPanel
              application={selectedApplication}
              onClose={() => setSelectedApplication(null)}
              onStatusChange={handleStatusChange}
              hideCloseButton
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

interface FilterDialogContentProps {
  activeFilter: ApplicationFilterTab;
  setActiveFilter: (filter: ApplicationFilterTab) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  counts: Record<ApplicationStatus | 'all', number>;
  onApply: () => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

function FilterDialogContent({
  activeFilter,
  setActiveFilter,
  sortBy,
  setSortBy,
  counts,
  onApply,
  onClear,
  hasActiveFilters,
}: FilterDialogContentProps) {
  return (
    <div className="mt-4 space-y-6">
      {/* Status Filter */}
      <div className="space-y-3">
        <Label className="font-medium">Status</Label>
        <RadioGroup
          value={activeFilter}
          onValueChange={(v) => setActiveFilter(v as ApplicationFilterTab)}
          className="grid grid-cols-2 gap-2"
        >
          {FILTER_OPTIONS.map((opt) => (
            <div key={opt.id} className="flex items-center gap-2">
              <RadioGroupItem value={opt.id} id={`status-${opt.id}`} />
              <Label htmlFor={`status-${opt.id}`} className="cursor-pointer">
                {opt.label} ({counts[opt.id]})
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Sort */}
      <div className="space-y-3">
        <Label className="font-medium">Sort By</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClear}
          disabled={!hasActiveFilters}
        >
          Clear All
        </Button>
        <Button className="flex-1" onClick={onApply}>
          Apply
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ activeFilter }: { activeFilter: ApplicationFilterTab }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
      <p className="font-medium text-lg">No applications found</p>
      <p className="text-muted-foreground text-sm">
        {activeFilter === 'all'
          ? 'No one has applied to this job yet.'
          : `No applications with status "${activeFilter}".`}
      </p>
    </div>
  );
}
