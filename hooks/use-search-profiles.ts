'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  ApplicantSearchFilters,
  ApplicantSearchProfile,
  EducationDegree,
  EmploymentType,
} from '@/components/applicant/types';
import {
  type BackendEmploymentType,
  type CreateSearchProfileRequest,
  type DegreeType,
  discoveryApi,
  fromEmploymentTypeIndices,
  type SearchProfile,
  toEmploymentTypeIndices,
  type UpdateSearchProfileRequest,
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
 * Map backend employment type to frontend type
 */
function fromBackendEmploymentType(
  type: BackendEmploymentType
): EmploymentType {
  const mapping: Record<BackendEmploymentType, EmploymentType> = {
    FULL_TIME: 'full-time',
    PART_TIME: 'part-time',
    FRESHER: 'internship', // Map FRESHER to internship
    INTERNSHIP: 'internship',
    CONTRACT: 'contract',
  };
  return mapping[type];
}

/**
 * Convert backend SearchProfile to frontend ApplicantSearchProfile
 */
function toFrontendSearchProfile(
  profile: SearchProfile,
  skillTagNames: Map<number, string>
): ApplicantSearchProfile {
  // Convert skill IDs to names
  const skills = profile.skillTags
    .map((id) => skillTagNames.get(id))
    .filter((name): name is string => !!name);

  // Convert employment type indices to frontend types
  const backendTypes = fromEmploymentTypeIndices(profile.employmentType);
  const employmentTypes = backendTypes.map(fromBackendEmploymentType);

  // Convert education
  const education: EducationDegree[] = profile.highestDegree
    ? [fromBackendDegree(profile.highestDegree)]
    : [];

  return {
    id: profile.profileId,
    name: profile.name ?? `Profile ${profile.profileId.slice(0, 8)}`,
    skills,
    employmentTypes,
    country: profile.country ?? undefined,
    salaryRange:
      profile.salaryMin !== null || profile.salaryMax !== null
        ? {
            min: profile.salaryMin ?? undefined,
            max: profile.salaryMax ?? undefined,
          }
        : undefined,
    education,
    createdAt: profile.createdAt ?? new Date().toISOString(),
    updatedAt: profile.updatedAt ?? new Date().toISOString(),
  };
}

/**
 * Convert frontend profile data to backend request
 */
function toBackendCreateRequest(
  profileData: Omit<ApplicantSearchProfile, 'id' | 'createdAt' | 'updatedAt'>,
  companyId: string,
  skillNameToId: Map<string, number>
): CreateSearchProfileRequest {
  // Convert skill names to IDs
  const skillTags = profileData.skills
    .map((name) => skillNameToId.get(name.toLowerCase()))
    .filter((id): id is number => id !== undefined);

  // Convert employment types to indices
  const backendTypes = profileData.employmentTypes.map(toBackendEmploymentType);
  const employmentType = toEmploymentTypeIndices(backendTypes);

  // Get highest degree
  const highestDegree =
    profileData.education.length > 0
      ? toBackendDegree(profileData.education[0])
      : null;

  return {
    companyId,
    skillTags,
    employmentType,
    highestDegree,
    country: profileData.country ?? null,
    salaryMin: profileData.salaryRange?.min ?? null,
    salaryMax: profileData.salaryRange?.max ?? null,
  };
}

// ============================================
// Hook implementation
// ============================================

interface UseSearchProfilesOptions {
  companyId: string;
}

interface UseSearchProfilesReturn {
  profiles: ApplicantSearchProfile[];
  isLoading: boolean;
  error: Error | null;
  selectedProfile: ApplicantSearchProfile | null;
  selectProfile: (id: string | null) => void;
  createProfile: (
    profile: Omit<ApplicantSearchProfile, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<ApplicantSearchProfile | null>;
  updateProfile: (
    id: string,
    updates: Partial<ApplicantSearchProfile>
  ) => Promise<ApplicantSearchProfile | null>;
  deleteProfile: (id: string) => Promise<boolean>;
  applyProfile: (
    profile: ApplicantSearchProfile,
    setFilters: (filters: Partial<ApplicantSearchFilters>) => void
  ) => void;
  refetch: () => Promise<void>;
}

export function useSearchProfiles(
  options?: UseSearchProfilesOptions
): UseSearchProfilesReturn {
  const companyId = options?.companyId;

  const [profiles, setProfiles] = useState<ApplicantSearchProfile[]>([]);
  const [selectedProfile, setSelectedProfile] =
    useState<ApplicantSearchProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Cache for skill tag mappings
  const [skillTagNames] = useState<Map<number, string>>(new Map());
  const [skillNameToId] = useState<Map<string, number>>(new Map());

  // Fetch profiles on mount
  const fetchProfiles = useCallback(async () => {
    if (!companyId) return;

    setIsLoading(true);
    setError(null);

    try {
      const backendProfiles =
        await discoveryApi.getSearchProfilesByCompany(companyId);

      // Convert to frontend format
      const frontendProfiles = backendProfiles.map((p) =>
        toFrontendSearchProfile(p, skillTagNames)
      );

      setProfiles(frontendProfiles);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to fetch search profiles')
      );
    } finally {
      setIsLoading(false);
    }
  }, [companyId, skillTagNames]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const selectProfile = useCallback(
    (id: string | null) => {
      if (id === null) {
        setSelectedProfile(null);
        return;
      }
      const profile = profiles.find((p) => p.id === id) || null;
      setSelectedProfile(profile);
    },
    [profiles]
  );

  const createProfile = useCallback(
    async (
      profileData: Omit<
        ApplicantSearchProfile,
        'id' | 'createdAt' | 'updatedAt'
      >
    ): Promise<ApplicantSearchProfile | null> => {
      if (!companyId) {
        setError(new Error('Company ID is required'));
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const request = toBackendCreateRequest(
          profileData,
          companyId,
          skillNameToId
        );
        const created = await discoveryApi.createSearchProfile(request);

        const frontendProfile = toFrontendSearchProfile(created, skillTagNames);

        // Override with provided name since backend might not store it
        frontendProfile.name = profileData.name;

        setProfiles((prev) => [...prev, frontendProfile]);
        return frontendProfile;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to create profile')
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [companyId, skillNameToId, skillTagNames]
  );

  const updateProfile = useCallback(
    async (
      id: string,
      updates: Partial<ApplicantSearchProfile>
    ): Promise<ApplicantSearchProfile | null> => {
      setIsLoading(true);
      setError(null);

      try {
        // Build update request
        const updateRequest: UpdateSearchProfileRequest = {};

        if (updates.salaryRange !== undefined) {
          updateRequest.salaryMin = updates.salaryRange?.min ?? null;
          updateRequest.salaryMax = updates.salaryRange?.max ?? null;
        }

        if (updates.education !== undefined && updates.education.length > 0) {
          updateRequest.highestDegree = toBackendDegree(updates.education[0]);
        }

        if (updates.employmentTypes !== undefined) {
          const backendTypes = updates.employmentTypes.map(
            toBackendEmploymentType
          );
          updateRequest.employmentType = toEmploymentTypeIndices(backendTypes);
        }

        if (updates.country !== undefined) {
          updateRequest.country = updates.country ?? null;
        }

        if (updates.skills !== undefined) {
          updateRequest.skillTags = updates.skills
            .map((name) => skillNameToId.get(name.toLowerCase()))
            .filter((id): id is number => id !== undefined);
        }

        const updated = await discoveryApi.updateSearchProfile(
          id,
          updateRequest
        );

        const frontendProfile = toFrontendSearchProfile(updated, skillTagNames);

        // Preserve name from updates or existing profile
        const existingProfile = profiles.find((p) => p.id === id);
        frontendProfile.name =
          updates.name ?? existingProfile?.name ?? frontendProfile.name;

        setProfiles((prev) =>
          prev.map((profile) => (profile.id === id ? frontendProfile : profile))
        );

        return frontendProfile;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to update profile')
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [profiles, skillNameToId, skillTagNames]
  );

  const deleteProfile = useCallback(
    async (id: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await discoveryApi.deleteSearchProfile(id);

        setProfiles((prev) => prev.filter((p) => p.id !== id));

        if (selectedProfile?.id === id) {
          setSelectedProfile(null);
        }

        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to delete profile')
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [selectedProfile]
  );

  const applyProfile = useCallback(
    (
      profile: ApplicantSearchProfile,
      setFilters: (filters: Partial<ApplicantSearchFilters>) => void
    ) => {
      setFilters({
        skills: profile.skills,
        employmentTypes: profile.employmentTypes,
        education: profile.education,
        location: profile.country
          ? { type: 'country', value: profile.country }
          : undefined,
        salaryRange: profile.salaryRange,
      });
    },
    []
  );

  return {
    profiles,
    isLoading,
    error,
    selectedProfile,
    selectProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    applyProfile,
    refetch: fetchProfiles,
  };
}
