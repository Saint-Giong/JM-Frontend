'use client';

import { ApplicantDetailPanel } from '@/components/applicant';
import { useApplicantSearch } from '@/hooks/use-applicant-search';
import { mockApplicants } from '@/mocks';
import { useState } from 'react';
import {
  Pagination,
  ResultsSection,
  SearchBar,
  SearchHeader,
} from './_components';

export default function ApplicantSearchPage() {
  const [jobTitleSearch, setJobTitleSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(filters.skills.filter((s) => s !== skill));
  };

  const handleSearch = () => {
    setFullTextSearch(jobTitleSearch);
    setCurrentPage(1);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <SearchHeader />

      <SearchBar
        jobTitleSearch={jobTitleSearch}
        setJobTitleSearch={setJobTitleSearch}
        skills={filters.skills}
        onAddSkill={handleAddSkill}
        onRemoveSkill={handleRemoveSkill}
        onSearch={handleSearch}
      />

      {/* Content */}
      <div className="flex h-[calc(100vh-8.375rem)] flex-1 overflow-hidden">
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
