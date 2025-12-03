'use client';

import {
  ApplicantCard,
  ApplicantDetailPanel,
  COMMON_SKILLS,
} from '@/components/applicant';
import { useApplicantSearch } from '@/hooks/use-applicant-search';
import { mockApplicants } from '@/mocks';
import {
  Badge,
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@saint-giong/bamboo-ui';
import { Search, Users, X } from 'lucide-react';
import { useState } from 'react';

export default function ApplicantSearchPage() {
  const [jobTitleSearch, setJobTitleSearch] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState('');
  const [pagePopoverOpen, setPagePopoverOpen] = useState(false);
  const [pageInputError, setPageInputError] = useState(false);
  const pageSize = 10;

  const {
    applicants,
    totalCount,
    filters,
    setSkills,
    setFullTextSearch,
    resetFilters,
    selectedApplicant,
    setSelectedApplicant,
    markApplicant,
  } = useApplicantSearch(mockApplicants, { pageSize: 100 });

  // Pagination
  const totalPages = Math.ceil(applicants.length / pageSize);
  const paginatedApplicants = applicants.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAddSkill = (skill: string) => {
    if (skill && !filters.skills.includes(skill)) {
      setSkills([...filters.skills, skill]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(filters.skills.filter((s) => s !== skill));
  };

  const handleSearch = () => {
    setFullTextSearch(jobTitleSearch);
    setCurrentPage(1);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: 'job' | 'skill'
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'job') {
        handleSearch();
      } else {
        handleAddSkill(skillInput.trim());
      }
    }
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-[4rem] items-center gap-4 border-b px-6 py-4">
        <h1 className="font-semibold text-2xl">Applicant search</h1>
      </header>

      {/* Search Bar */}
      <div className="flex h-[4.375rem] items-center gap-4 border-b px-6 py-4">
        {/* Job Title Search */}
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-muted-foreground text-sm">
            Job title
          </span>
          <Input
            placeholder="Search"
            className="w-48"
            value={jobTitleSearch}
            onChange={(e) => setJobTitleSearch(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'job')}
          />
        </div>

        {/* Skill Tags */}
        <div className="flex flex-1 items-center gap-2">
          <span className="whitespace-nowrap text-muted-foreground text-sm">
            Skill tags
          </span>
          <div className="flex flex-1 items-center gap-2">
            <Select
              value=""
              onValueChange={(value) => {
                if (value) handleAddSkill(value);
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Search..." />
              </SelectTrigger>
              <SelectContent>
                {COMMON_SKILLS.filter((s) => !filters.skills.includes(s)).map(
                  (skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            {/* Selected Skills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {filters.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Search Button */}
        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {/* Content */}
      <div className="flex h-[calc(100vh-8.375rem)] flex-1 overflow-hidden">
        {/* Results */}
        <main
          className={`flex h-[calc(100vh-8.375rem)] flex-1 flex-col overflow-y-auto ${selectedApplicant ? 'w-1/2' : 'w-full'}`}
        >
          <ScrollArea className="flex-1">
            <div className="p-6">
              {/* Results Header */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-lg">Best match</h2>
                <span className="text-muted-foreground text-sm">
                  {totalCount} result{totalCount !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Results List */}
              {paginatedApplicants.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mb-2 font-semibold text-lg">
                    No applicants found
                  </h3>
                  <p className="max-w-sm text-muted-foreground">
                    Try adjusting your search filters to find more candidates.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {paginatedApplicants.map((applicant) => (
                    <ApplicantCard
                      key={applicant.id}
                      applicant={applicant}
                      onClick={() => setSelectedApplicant(applicant)}
                      onMark={(mark) => markApplicant(applicant.id, mark)}
                      isSelected={selectedApplicant?.id === applicant.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 border-t p-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>Previous</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {(() => {
                  const pages: (number | 'ellipsis')[] = [];

                  // Always show first page
                  pages.push(1);

                  // Calculate range around current page
                  const rangeStart = Math.max(2, currentPage - 1);
                  const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

                  // Add ellipsis after first page if needed
                  if (rangeStart > 2) {
                    pages.push('ellipsis');
                  }

                  // Add pages in range
                  for (let i = rangeStart; i <= rangeEnd; i++) {
                    pages.push(i);
                  }

                  // Add ellipsis before last page if needed
                  if (rangeEnd < totalPages - 1) {
                    pages.push('ellipsis');
                  }

                  // Always show last page if more than 1 page
                  if (totalPages > 1) {
                    pages.push(totalPages);
                  }

                  return pages.map((page, idx) =>
                    page === 'ellipsis' ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 text-muted-foreground"
                      >
                        ...
                      </span>
                    ) : (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setCurrentPage(page)}
                        className="h-9 w-9"
                      >
                        {page}
                      </Button>
                    )
                  );
                })()}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>Next</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>

              {/* Page popover */}
              <Popover
                open={pagePopoverOpen}
                onOpenChange={(open) => {
                  setPagePopoverOpen(open);
                  if (!open) setPageInputError(false);
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 tabular-nums"
                    onClick={() => {
                      setPageInputValue(String(currentPage));
                      setPageInputError(false);
                    }}
                  >
                    {currentPage} / {totalPages}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-3" align="center">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Go to page</p>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={pageInputValue}
                        onChange={(e) => {
                          setPageInputValue(e.target.value);
                          setPageInputError(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const page = parseInt(pageInputValue, 10);
                            if (page >= 1 && page <= totalPages) {
                              setCurrentPage(page);
                              setPagePopoverOpen(false);
                              setPageInputError(false);
                            } else {
                              setPageInputError(true);
                              setTimeout(() => {
                                setPageInputError(false);
                                setPageInputValue(String(currentPage));
                              }, 500);
                            }
                          }
                        }}
                        className={`h-8 transition-all ${
                          pageInputError
                            ? 'border-red-500 text-red-500 focus-visible:ring-red-500 animate-[shake_0.5s_ease-in-out]'
                            : ''
                        }`}
                        autoFocus
                      />
                      <Button
                        size="sm"
                        className="h-8"
                        onClick={() => {
                          const page = parseInt(pageInputValue, 10);
                          if (page >= 1 && page <= totalPages) {
                            setCurrentPage(page);
                            setPagePopoverOpen(false);
                            setPageInputError(false);
                          } else {
                            setPageInputError(true);
                            setTimeout(() => {
                              setPageInputError(false);
                              setPageInputValue(String(currentPage));
                            }, 500);
                          }
                        }}
                      >
                        Go
                      </Button>
                    </div>
                    {pageInputError && (
                      <p className="text-xs text-red-500">
                        Enter 1-{totalPages}
                      </p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </main>

        {/* Detail Panel */}
        {selectedApplicant && (
          <aside className="h-[calc(100vh-8.375rem)] w-1/2 overflow-y-auto border-l">
            <ApplicantDetailPanel
              applicant={selectedApplicant}
              onClose={() => setSelectedApplicant(null)}
              onMark={markApplicant}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
