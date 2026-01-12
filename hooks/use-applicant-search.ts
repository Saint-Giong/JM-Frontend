'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  Applicant,
  ApplicantMark,
  ApplicantSearchFilters,
  EducationDegree,
  EmploymentType,
  LocationFilter,
  SalaryRange,
  WorkExperienceFilter,
} from '@/components/applicant/types';
import {
  type ApplicantDocument,
  type ApplicantSearchParams,
  type BackendEmploymentType,
  type DegreeType,
  discoveryApi,
} from '@/lib/api/discovery';

// ============================================
// Type transformation utilities
// ============================================

/**
 * Map frontend degree to backend degree type
 */
function toBackendDegree(degree: EducationDegree): DegreeType {
  const mapping: Record<EducationDegree, DegreeType> = {
    bachelor: 'BACHELOR',
    master: 'MASTER',
    doctorate: 'DOCTORATE',
  };
  return mapping[degree];
}

/**
 * Map backend degree to frontend degree type
 */
function fromBackendDegree(degree: DegreeType): EducationDegree {
  const mapping: Record<DegreeType, EducationDegree> = {
    BACHELOR: 'bachelor',
    MASTER: 'master',
    DOCTORATE: 'doctorate',
  };
  return mapping[degree];
}

/**
 * Map frontend employment type to backend type
 */
function toBackendEmploymentType(type: EmploymentType): BackendEmploymentType {
  const mapping: Record<EmploymentType, BackendEmploymentType> = {
    'full-time': 'FULL_TIME',
    'part-time': 'PART_TIME',
    internship: 'INTERNSHIP',
    contract: 'CONTRACT',
  };
  return mapping[type];
}

/**
 * Convert ApplicantDocument from API to frontend Applicant type
 */
function toFrontendApplicant(
  doc: ApplicantDocument,
  skillNames: Map<number, string>
): Applicant {
  // Get highest degree from education list
  let highestDegree: EducationDegree = 'bachelor';
  const degreeOrder: DegreeType[] = ['BACHELOR', 'MASTER', 'DOCTORATE'];
  let highestIndex = -1;

  for (const edu of doc.educationList) {
    const index = degreeOrder.indexOf(edu.degree);
    if (index > highestIndex) {
      highestIndex = index;
      highestDegree = fromBackendDegree(edu.degree);
    }
  }

  // Convert skills
  const skills = doc.skillIds
    .map((id) => skillNames.get(id))
    .filter((name): name is string => !!name);

  // Convert education
  const education = doc.educationList.map((edu) => ({
    degree: fromBackendDegree(edu.degree),
    field: edu.description,
    institution: edu.institutionName,
    graduationYear: new Date(edu.endDate).getFullYear(),
  }));

  // Convert work experience
  const workExperience = doc.workExperienceList.map((exp) => ({
    title: exp.position,
    company: exp.companyName,
    startDate: exp.startDate,
    endDate: exp.isCurrent ? null : exp.endDate,
    description: exp.description,
  }));

  return {
    id: doc.applicantId,
    firstName: doc.firstName,
    lastName: doc.lastName,
    email: '', // Not provided in API response
    city: doc.city,
    country: doc.country,
    highestDegree,
    education,
    workExperience,
    objectiveSummary: doc.biography,
    skills,
    employmentTypes: [], // Not stored on applicant directly
    mark: null,
    avatarUrl: doc.avatarUrl,
  };
}

/**
 * Convert frontend filters to API search params
 */
function toApiSearchParams(
  filters: ApplicantSearchFilters,
  page: number,
  size: number,
  skillNameToId: Map<string, number>
): ApplicantSearchParams {
  const params: ApplicantSearchParams = {
    page,
    size,
  };

  // Location filter
  if (filters.location?.value) {
    if (filters.location.type === 'country') {
      params.country = filters.location.value;
    } else {
      params.city = filters.location.value;
    }
  }

  // Education filter (use first selected degree)
  if (filters.education.length > 0) {
    params.degree = toBackendDegree(filters.education[0]);
  }

  // Employment types
  if (filters.employmentTypes.length > 0) {
    params.employmentTypes = filters.employmentTypes.map(
      toBackendEmploymentType
    );
  }

  // Skills filter
  if (filters.skills.length > 0) {
    const skillIds = filters.skills
      .map((name) => skillNameToId.get(name.toLowerCase()))
      .filter((id): id is number => id !== undefined);
    if (skillIds.length > 0) {
      params.skillIds = skillIds;
    }
  }

  // Full-text search
  if (filters.fullTextSearch.trim()) {
    params.query = filters.fullTextSearch.trim();
  }

  // Salary range
  if (filters.salaryRange?.min !== undefined) {
    params.salaryMin = filters.salaryRange.min;
  }
  if (filters.salaryRange?.max !== undefined) {
    params.salaryMax = filters.salaryRange.max;
  }

  return params;
}

// ============================================
// Default values
// ============================================

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
  /**
   * When true, uses server-side search via API.
   * When false, uses client-side filtering (legacy behavior).
   */
  serverSide?: boolean;
}

export function useApplicantSearch(
  applicantsOrNull: Applicant[] | null = null,
  options: UseApplicantSearchOptions = {}
) {
  const { initialFilters, pageSize = 10, serverSide = true } = options;

  const [filters, setFilters] = useState<ApplicantSearchFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [serverApplicants, setServerApplicants] = useState<Applicant[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );

  // Skill name to ID mapping (populated from API or props)
  const [skillNameToId] = useState<Map<string, number>>(new Map());
  const [skillIdToName] = useState<Map<number, string>>(new Map());

  // Client-side filtering for legacy mode
  const clientFilteredApplicants = useMemo(() => {
    if (serverSide || !applicantsOrNull) return [];

    return applicantsOrNull.filter((applicant) => {
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

      // Employment types filter
      if (filters.employmentTypes.length > 0) {
        const hasMatchingType = filters.employmentTypes.some((type) =>
          applicant.employmentTypes.includes(type)
        );
        if (!hasMatchingType) return false;
      }

      // Skills filter
      if (filters.skills.length > 0) {
        const hasAnySkill = filters.skills.some((skill) =>
          applicant.skills.some((s) => s.toLowerCase() === skill.toLowerCase())
        );
        if (!hasAnySkill) return false;
      }

      // Full-text search
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
  }, [applicantsOrNull, filters, serverSide]);

  // Server-side search
  const searchServer = useCallback(async () => {
    if (!serverSide) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = toApiSearchParams(filters, page, pageSize, skillNameToId);
      const result = await discoveryApi.searchApplicants(params);

      const frontendApplicants = result.content.map((doc) =>
        toFrontendApplicant(doc, skillIdToName)
      );

      setServerApplicants(frontendApplicants);
      setTotalCount(result.totalElements);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to search applicants')
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, pageSize, serverSide, skillNameToId, skillIdToName]);

  // Auto-fetch on mount and when filters/page change for server-side mode
  // biome-ignore lint/correctness/useExhaustiveDependencies: searchServer is stable
  useEffect(() => {
    if (serverSide) {
      searchServer();
    }
  }, [serverSide, filters, page, pageSize]);

  const applicants = serverSide
    ? serverApplicants
    : clientFilteredApplicants.slice(0, (page + 1) * pageSize);

  const hasMore = serverSide
    ? page < totalPages - 1
    : (page + 1) * pageSize < clientFilteredApplicants.length;

  const displayedCount = applicants.length;

  // Load more for lazy loading
  const loadMore = useCallback(() => {
    if (serverSide) {
      setPage((prev) => prev + 1);
    } else {
      setPage((prev) => prev + 1);
    }
  }, [serverSide]);

  // Update filters and reset pagination
  const updateFilters = useCallback(
    (newFilters: Partial<ApplicantSearchFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setPage(0);
    },
    []
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

  const setSalaryRange = useCallback(
    (salaryRange: SalaryRange | undefined) => {
      updateFilters({ salaryRange });
    },
    [updateFilters]
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(0);
  }, []);

  // Go to specific page (0-indexed internally)
  const goToPage = useCallback((pageNumber: number) => {
    setPage(Math.max(0, pageNumber));
  }, []);

  // Mark applicant (favorite/warning)
  const markApplicant = useCallback((id: string, mark: ApplicantMark) => {
    // In production, this would call an API
    console.log('Mark applicant:', id, mark);
  }, []);

  return {
    // Data
    applicants,
    totalCount: serverSide ? totalCount : clientFilteredApplicants.length,
    displayedCount,
    hasMore,
    isLoading,
    error,

    // Filters
    filters,
    updateFilters,
    setLocation,
    setEducation,
    setWorkExperience,
    setEmploymentTypes,
    setSkills,
    setFullTextSearch,
    setSalaryRange,
    resetFilters,

    // Pagination
    page,
    totalPages: serverSide
      ? totalPages
      : Math.ceil(clientFilteredApplicants.length / pageSize),
    loadMore,
    goToPage,

    // Selection
    selectedApplicant,
    setSelectedApplicant,

    // Actions
    markApplicant,
    search: searchServer,
  };
}
