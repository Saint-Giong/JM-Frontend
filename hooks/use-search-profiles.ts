'use client';

import type {
  ApplicantSearchFilters,
  ApplicantSearchProfile,
} from '@/components/applicant/types';
import { mockSearchProfiles } from '@/mocks/search-profiles';
import { useCallback, useState } from 'react';

interface UseSearchProfilesReturn {
  profiles: ApplicantSearchProfile[];
  isLoading: boolean;
  selectedProfile: ApplicantSearchProfile | null;
  selectProfile: (id: string | null) => void;
  createProfile: (
    profile: Omit<ApplicantSearchProfile, 'id' | 'createdAt' | 'updatedAt'>
  ) => ApplicantSearchProfile;
  updateProfile: (
    id: string,
    updates: Partial<ApplicantSearchProfile>
  ) => ApplicantSearchProfile | null;
  deleteProfile: (id: string) => boolean;
  applyProfile: (
    profile: ApplicantSearchProfile,
    setFilters: (filters: Partial<ApplicantSearchFilters>) => void
  ) => void;
}

export function useSearchProfiles(): UseSearchProfilesReturn {
  // In production, this would use React Query to fetch from API
  // For now, we use local state with mock data
  const [profiles, setProfiles] =
    useState<ApplicantSearchProfile[]>(mockSearchProfiles);
  const [selectedProfile, setSelectedProfile] =
    useState<ApplicantSearchProfile | null>(null);
  const [isLoading] = useState(false);

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
    (
      profileData: Omit<
        ApplicantSearchProfile,
        'id' | 'createdAt' | 'updatedAt'
      >
    ): ApplicantSearchProfile => {
      const now = new Date().toISOString().split('T')[0];
      const newProfile: ApplicantSearchProfile = {
        ...profileData,
        id: String(Date.now()),
        createdAt: now,
        updatedAt: now,
      };
      setProfiles((prev) => [...prev, newProfile]);
      return newProfile;
    },
    []
  );

  const updateProfile = useCallback(
    (
      id: string,
      updates: Partial<ApplicantSearchProfile>
    ): ApplicantSearchProfile | null => {
      let updatedProfile: ApplicantSearchProfile | null = null;
      setProfiles((prev) =>
        prev.map((profile) => {
          if (profile.id === id) {
            updatedProfile = {
              ...profile,
              ...updates,
              updatedAt: new Date().toISOString().split('T')[0],
            };
            return updatedProfile;
          }
          return profile;
        })
      );
      return updatedProfile;
    },
    []
  );

  const deleteProfile = useCallback(
    (id: string): boolean => {
      let deleted = false;
      setProfiles((prev) => {
        const filtered = prev.filter((p) => p.id !== id);
        deleted = filtered.length < prev.length;
        return filtered;
      });
      if (selectedProfile?.id === id) {
        setSelectedProfile(null);
      }
      return deleted;
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
    selectedProfile,
    selectProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    applyProfile,
  };
}
