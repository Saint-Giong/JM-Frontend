import { useMemo, useState, useCallback } from 'react';
import type {
  Applicant,
  ApplicantMark,
  ApplicantSearchFilters,
  EducationDegree,
  EmploymentType,
  LocationFilter,
  WorkExperienceFilter,
} from '@/components/applicant/types';

const DEFAULT_FILTERS: ApplicantSearchFilters = {
  location: { type: 'country', value: 'Vietnam' },
  education: [],
  workExperience: { type: 'any' },
  employmentTypes: [],
  skills: [],
  fullTextSearch: '',
};

interface UseApplicantSearchOptions {
  initialFilters?: Partial<ApplicantSearchFilters>;
  pageSize?: number;
}

export function useApplicantSearch(
  applicants: Applicant[],
  options: UseApplicantSearchOptions = {}
) {
  const { initialFilters, pageSize = 10 } = options;

  const [filters, setFilters] = useState<ApplicantSearchFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [displayCount, setDisplayCount] = useState(pageSize);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );

  // Filter applicants based on all criteria
  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => {
      // Location filter
      if (filters.location?.value) {
        const locationMatch =
          filters.location.type === 'country'
            ? applicant.country.toLowerCase() ===
              filters.location.value.toLowerCase()
            : applicant.city.toLowerCase() ===
              filters.location.value.toLowerCase();
        if (!locationMatch) return false;
      }

      // Education filter
      if (filters.education.length > 0) {
        if (!filters.education.includes(applicant.highestDegree)) {
          return false;
        }
      }

      // Work experience filter
      if (filters.workExperience.type === 'none') {
        if (applicant.workExperience.length > 0) return false;
      } else if (
        filters.workExperience.type === 'keyword' &&
        filters.workExperience.value
      ) {
        const keyword = filters.workExperience.value.toLowerCase();
        const hasKeyword = applicant.workExperience.some(
          (exp) =>
            exp.title.toLowerCase().includes(keyword) ||
            exp.company.toLowerCase().includes(keyword) ||
            exp.description.toLowerCase().includes(keyword)
        );
        if (!hasKeyword) return false;
      }

      // Employment types filter (multiple selection)
      if (filters.employmentTypes.length > 0) {
        const hasMatchingType = filters.employmentTypes.some((type) =>
          applicant.employmentTypes.includes(type)
        );
        if (!hasMatchingType) return false;
      }

      // Skills filter (OR logic)
      if (filters.skills.length > 0) {
        const hasAnySkill = filters.skills.some((skill) =>
          applicant.skills.some((s) => s.toLowerCase() === skill.toLowerCase())
        );
        if (!hasAnySkill) return false;
      }

      // Full-text search (across work experience, objective, skills)
      if (filters.fullTextSearch.trim()) {
        const searchTerms = filters.fullTextSearch.toLowerCase().split(/\s+/);
        const searchableText = [
          applicant.objectiveSummary,
          ...applicant.skills,
          ...applicant.workExperience.map(
            (exp) => `${exp.title} ${exp.description}`
          ),
        ]
          .join(' ')
          .toLowerCase();

        const hasAllTerms = searchTerms.every((term) =>
          searchableText.includes(term)
        );
        if (!hasAllTerms) return false;
      }

      return true;
    });
  }, [applicants, filters]);

  // Lazy-loaded results
  const displayedApplicants = useMemo(() => {
    return filteredApplicants.slice(0, displayCount);
  }, [filteredApplicants, displayCount]);

  const hasMore = displayCount < filteredApplicants.length;

  // Load more for lazy loading
  const loadMore = useCallback(() => {
    setDisplayCount((prev) =>
      Math.min(prev + pageSize, filteredApplicants.length)
    );
  }, [pageSize, filteredApplicants.length]);

  // Reset display count when filters change
  const updateFilters = useCallback(
    (newFilters: Partial<ApplicantSearchFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setDisplayCount(pageSize);
    },
    [pageSize]
  );

  // Individual filter setters
  const setLocation = useCallback(
    (location: LocationFilter | undefined) => {
      updateFilters({ location });
    },
    [updateFilters]
  );

  const setEducation = useCallback(
    (education: EducationDegree[]) => {
      updateFilters({ education });
    },
    [updateFilters]
  );

  const setWorkExperience = useCallback(
    (workExperience: WorkExperienceFilter) => {
      updateFilters({ workExperience });
    },
    [updateFilters]
  );

  const setEmploymentTypes = useCallback(
    (employmentTypes: EmploymentType[]) => {
      updateFilters({ employmentTypes });
    },
    [updateFilters]
  );

  const setSkills = useCallback(
    (skills: string[]) => {
      updateFilters({ skills });
    },
    [updateFilters]
  );

  const setFullTextSearch = useCallback(
    (fullTextSearch: string) => {
      updateFilters({ fullTextSearch });
    },
    [updateFilters]
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setDisplayCount(pageSize);
  }, [pageSize]);

  // Mark applicant (favorite/warning)
  const markApplicant = useCallback((id: string, mark: ApplicantMark) => {
    // In real app, this would call an API
    console.log('Mark applicant:', id, mark);
  }, []);

  return {
    // Data
    applicants: displayedApplicants,
    totalCount: filteredApplicants.length,
    displayedCount: displayedApplicants.length,
    hasMore,

    // Filters
    filters,
    updateFilters,
    setLocation,
    setEducation,
    setWorkExperience,
    setEmploymentTypes,
    setSkills,
    setFullTextSearch,
    resetFilters,

    // Lazy loading
    loadMore,

    // Selection
    selectedApplicant,
    setSelectedApplicant,

    // Actions
    markApplicant,
  };
}
