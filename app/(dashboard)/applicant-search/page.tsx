'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@saint-giong/bamboo-ui';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ApplicantDetailPanel } from '@/components/applicant';
import type {
  EducationDegree,
  EmploymentType,
  WorkExperienceFilter,
} from '@/components/applicant/types';
import { useApplicantSearch } from '@/hooks/use-applicant-search';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  Pagination,
  ResultsSection,
  SearchFilters,
  SearchHeader,
} from './_components';

export default function ApplicantSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Parse URL params
  const initialKeyword = searchParams.get('keyword') || '';
  const initialName = searchParams.get('name') || '';
  const initialLocation = searchParams.get('location');
  const initialIsCountry = searchParams.get('isCountry') === 'true';
  const initialEducation = searchParams.get('education')
    ? (searchParams.get('education')!.split(',') as EducationDegree[])
    : [];
  const initialSkills = searchParams.get('skills')
    ? searchParams.get('skills')!.split(',')
    : [];
  const initialPage = parseInt(searchParams.get('page') || '0', 10);
  const initialSize = parseInt(searchParams.get('size') || '20', 10);

  const [fullTextSearch, setFullTextSearch] = useState(
    initialKeyword || initialName
  );

  const {
    applicants,
    totalCount,
    filters,
    isLoading,
    error,
    page,
    totalPages,
    setLocation,
    setEducation,
    setWorkExperience,
    setEmploymentTypes,
    setSkills,
    setFullTextSearch: applyFullTextSearch,
    resetFilters,
    selectedApplicant,
    setSelectedApplicant,
    markApplicant,
    goToPage,
  } = useApplicantSearch(null, {
    pageSize: initialSize,
    serverSide: true,
    initialFilters: {
      fullTextSearch: initialKeyword || initialName,
      location: initialLocation
        ? {
            type: initialIsCountry ? 'country' : 'city',
            value: initialLocation,
          }
        : undefined,
      education: initialEducation,
      skills: initialSkills,
    },
  });

  // Sync state with URL params on initial load
  useEffect(() => {
    // If page is provided in URL, update it
    if (initialPage > 0) {
      goToPage(initialPage);
    }
  }, [initialPage, goToPage]);

  // Update URL when filters change
  const updateUrlParams = useCallback(
    (newParams: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      router.replace(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handleSearch = () => {
    applyFullTextSearch(fullTextSearch);
    updateUrlParams({
      keyword: fullTextSearch || null,
      page: '0', // Reset page on new search
    });
  };

  const handlePageChange = (newPage: number) => {
    // UI uses 1-indexed pages, hook uses 0-indexed
    goToPage(newPage - 1);
    updateUrlParams({ page: (newPage - 1).toString() });
  };

  const handleLocationChange = (
    location: { type: 'city' | 'country'; value: string } | undefined
  ) => {
    setLocation(location);
    updateUrlParams({
      location: location?.value || null,
      isCountry: location?.type === 'country' ? 'true' : null,
      page: '0',
    });
  };

  const handleEducationChange = (education: EducationDegree[]) => {
    setEducation(education);
    updateUrlParams({
      education: education.length > 0 ? education.join(',') : null,
      page: '0',
    });
  };

  const handleSkillsChange = (skills: string[]) => {
    setSkills(skills);
    updateUrlParams({
      skills: skills.length > 0 ? skills.join(',') : null,
      page: '0',
    });
  };

  const handleWorkExperienceChange = (workExperience: WorkExperienceFilter) => {
    setWorkExperience(workExperience);
    // Note: URL param for experienceType is not fully supported in the hook's initialFilters yet,
    // but we can map it if needed. For now, just updating state.
  };

  const handleEmploymentTypesChange = (employmentTypes: EmploymentType[]) => {
    setEmploymentTypes(employmentTypes);
  };

  const handleResetFilters = () => {
    resetFilters();
    setFullTextSearch('');
    router.replace('/applicant-search');
  };

  // Error state
  if (error) {
    return (
      <div className="flex h-screen flex-col">
        <SearchHeader />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div className="text-center">
            <h2 className="font-semibold text-lg">Failed to load applicants</h2>
            <p className="mt-1 max-w-md text-muted-foreground text-sm">
              {error.message || 'An error occurred while fetching applicants.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Loading state (initial load)
  if (isLoading && applicants.length === 0) {
    return (
      <div className="flex h-screen flex-col">
        <SearchHeader />
        <SearchFilters
          fullTextSearch={fullTextSearch}
          onFullTextSearchChange={setFullTextSearch}
          location={filters.location}
          onLocationChange={handleLocationChange}
          education={filters.education}
          onEducationChange={handleEducationChange}
          workExperience={filters.workExperience}
          onWorkExperienceChange={handleWorkExperienceChange}
          employmentTypes={filters.employmentTypes}
          onEmploymentTypesChange={handleEmploymentTypesChange}
          skills={filters.skills}
          onSkillsChange={handleSkillsChange}
          onSearch={handleSearch}
        />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              Loading applicants...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Layout: Single scrollable page */}
      <div className="h-[calc(100vh-4rem)] overflow-y-auto md:h-screen lg:hidden">
        <SearchHeader />
        <SearchFilters
          fullTextSearch={fullTextSearch}
          onFullTextSearchChange={setFullTextSearch}
          location={filters.location}
          onLocationChange={handleLocationChange}
          education={filters.education}
          onEducationChange={handleEducationChange}
          workExperience={filters.workExperience}
          onWorkExperienceChange={handleWorkExperienceChange}
          employmentTypes={filters.employmentTypes}
          onEmploymentTypesChange={handleEmploymentTypesChange}
          skills={filters.skills}
          onSkillsChange={handleSkillsChange}
          onSearch={handleSearch}
        />
        <ResultsSection
          applicants={applicants}
          totalCount={totalCount}
          selectedApplicant={selectedApplicant}
          onSelectApplicant={setSelectedApplicant}
          onMarkApplicant={markApplicant}
          onResetFilters={handleResetFilters}
          isLoading={isLoading}
          disableScroll
        >
          <Pagination
            currentPage={page + 1}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </ResultsSection>
      </div>

      {/* Desktop Layout: Sticky header/filters + scrollable split view */}
      <div className="hidden h-screen flex-col overflow-hidden lg:flex">
        <SearchHeader />
        <SearchFilters
          fullTextSearch={fullTextSearch}
          onFullTextSearchChange={setFullTextSearch}
          location={filters.location}
          onLocationChange={handleLocationChange}
          education={filters.education}
          onEducationChange={handleEducationChange}
          workExperience={filters.workExperience}
          onWorkExperienceChange={handleWorkExperienceChange}
          employmentTypes={filters.employmentTypes}
          onEmploymentTypesChange={handleEmploymentTypesChange}
          skills={filters.skills}
          onSkillsChange={handleSkillsChange}
          onSearch={handleSearch}
        />

        {/* Split view content */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <ResultsSection
            applicants={applicants}
            totalCount={totalCount}
            selectedApplicant={selectedApplicant}
            onSelectApplicant={setSelectedApplicant}
            onMarkApplicant={markApplicant}
            onResetFilters={handleResetFilters}
            isLoading={isLoading}
          >
            <Pagination
              currentPage={page + 1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </ResultsSection>

          {/* Desktop: Side Panel */}
          {selectedApplicant && (
            <aside className="w-1/2 overflow-y-auto border-l">
              <ApplicantDetailPanel
                applicant={selectedApplicant}
                onClose={() => setSelectedApplicant(null)}
                onMark={markApplicant}
              />
            </aside>
          )}
        </div>
      </div>

      {/* Mobile/Tablet: Sheet */}
      <Sheet
        open={!!selectedApplicant && !isDesktop}
        onOpenChange={(open) => !open && setSelectedApplicant(null)}
      >
        <SheetContent
          side="right"
          className="flex h-full w-full flex-col overflow-hidden p-0 sm:max-w-lg"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Applicant Details</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <ApplicantDetailPanel
              applicant={selectedApplicant}
              onClose={() => setSelectedApplicant(null)}
              onMark={markApplicant}
              hideCloseButton
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
