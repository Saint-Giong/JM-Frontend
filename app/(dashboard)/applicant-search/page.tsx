'use client';

import { ApplicantDetailPanel } from '@/components/applicant';
import { useApplicantSearch } from '@/hooks/use-applicant-search';
import { useMediaQuery } from '@/hooks/use-media-query';
import { mockApplicants } from '@/mocks';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@saint-giong/bamboo-ui';
import { useState } from 'react';
import {
  Pagination,
  ResultsSection,
  SearchFilters,
  SearchHeader,
} from './_components';

export default function ApplicantSearchPage() {
  const [fullTextSearch, setFullTextSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const {
    applicants,
    totalCount,
    filters,
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
  } = useApplicantSearch(mockApplicants, { pageSize: 100 });

  // Pagination
  const totalPages = Math.ceil(applicants.length / pageSize);
  const paginatedApplicants = applicants.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSearch = () => {
    applyFullTextSearch(fullTextSearch);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Mobile Layout: Single scrollable page */}
      <div className="h-[calc(100vh-4rem)] overflow-y-auto md:h-screen lg:hidden">
        <SearchHeader />
        <SearchFilters
          fullTextSearch={fullTextSearch}
          onFullTextSearchChange={setFullTextSearch}
          location={filters.location}
          onLocationChange={setLocation}
          education={filters.education}
          onEducationChange={setEducation}
          workExperience={filters.workExperience}
          onWorkExperienceChange={setWorkExperience}
          employmentTypes={filters.employmentTypes}
          onEmploymentTypesChange={setEmploymentTypes}
          skills={filters.skills}
          onSkillsChange={setSkills}
          onSearch={handleSearch}
        />
        <ResultsSection
          applicants={paginatedApplicants}
          totalCount={totalCount}
          selectedApplicant={selectedApplicant}
          onSelectApplicant={setSelectedApplicant}
          onMarkApplicant={markApplicant}
          onResetFilters={resetFilters}
          disableScroll
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
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
          onLocationChange={setLocation}
          education={filters.education}
          onEducationChange={setEducation}
          workExperience={filters.workExperience}
          onWorkExperienceChange={setWorkExperience}
          employmentTypes={filters.employmentTypes}
          onEmploymentTypesChange={setEmploymentTypes}
          skills={filters.skills}
          onSkillsChange={setSkills}
          onSearch={handleSearch}
        />

        {/* Split view content */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <ResultsSection
            applicants={paginatedApplicants}
            totalCount={totalCount}
            selectedApplicant={selectedApplicant}
            onSelectApplicant={setSelectedApplicant}
            onMarkApplicant={markApplicant}
            onResetFilters={resetFilters}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
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
