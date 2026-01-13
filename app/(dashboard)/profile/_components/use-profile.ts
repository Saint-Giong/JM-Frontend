'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCompany } from '@/hooks';
import { useJobPost } from '@/hooks/use-jobpost';
import { toJob } from '@/lib/api/jobpost';
import { mockActivities } from '@/mocks/activities';
import { useAuthStore, useProfileStore } from '@/stores';
import { fromCompany, type ProfileFormData, toCompanyUpdate } from './types';

function getInitials(name: string): string {
  if (!name) return 'CO';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Hook for managing company profile with API integration
 *
 * Provides full CRUD operations for company profiles, including:
 * - Fetching company data from API
 * - Creating new company profiles
 * - Updating existing profiles
 * - Local form state management
 * - Loading and error states
 */
export function useProfile() {
  // Get companyId from auth store
  const authCompanyId = useAuthStore((state) => state.companyId);

  const {
    company,
    isLoading: isLoadingCompany,
    isCreating,
    isUpdating,
    error: apiError,
    fieldErrors,
    fetchCompany,
    createCompany,
    updateCompany,
    clearError,
  } = useCompany();

  // Fetch job posts for the company
  const {
    jobs: jobResponses,
    isLoading: isLoadingJobs,
    fetchJobsByCompany,
  } = useJobPost();

  // Use Zustand store for shared edit mode state
  const isEditMode = useProfileStore((state) => state.isEditMode);
  const setEditMode = useProfileStore((state) => state.setEditMode);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Track user edits separately from company data
  const [userEdits, setUserEdits] = useState<Partial<ProfileFormData>>({});

  // Use companyId from auth store, or allow override
  const [overrideCompanyId, setOverrideCompanyId] = useState<
    string | undefined
  >(undefined);
  const companyId = overrideCompanyId || authCompanyId || undefined;

  // Compute form data: company data as base, with user edits overlaid
  const baseFormData = useMemo<ProfileFormData>(() => {
    if (company) {
      return fromCompany(company, {
        website: '',
        email: '',
      });
    }
    return {
      companyName: '',
      website: '',
      aboutUs: '',
      whoWeAreLookingFor: '',
      address: '',
      city: '',
      country: '',
      phone: '',
      email: '',
    };
  }, [company]);

  // Merge base data with user edits
  const formData = useMemo<ProfileFormData>(
    () => ({ ...baseFormData, ...userEdits }),
    [baseFormData, userEdits]
  );

  // Load company data on mount if companyId is set
  useEffect(() => {
    if (companyId) {
      fetchCompany(companyId);
      fetchJobsByCompany(companyId);
    }
  }, [companyId, fetchCompany, fetchJobsByCompany]);

  const city = formData.city || '';
  const country = formData.country || '';
  const displayName = formData.companyName || 'Company Name';
  const initials = getInitials(displayName);

  // Loading state combines all API states
  const isSaving = isCreating || isUpdating;

  // Track initialization state
  const [isInitialized, setIsInitialized] = useState(!companyId);

  // Handle fetch completion
  useEffect(() => {
    if (!companyId) {
      setIsInitialized(true);
      return;
    }

    if (isLoadingCompany) {
      return;
    }

    if (company) {
      setIsInitialized(true);
    } else if (apiError) {
      setIsInitialized(true);
      clearError();
    }
  }, [companyId, isLoadingCompany, company, apiError, clearError]);

  const isLoading = !isInitialized || isLoadingCompany;
  const resourceNotFound = isInitialized && !company;

  const updateFormField = useCallback(
    <K extends keyof ProfileFormData>(field: K, value: ProfileFormData[K]) => {
      setUserEdits((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSaveProfile = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaveSuccess(false);
      clearError();

      const companyData = toCompanyUpdate(formData);
      let success = false;
      let newCompanyId: string | undefined;

      if (company?.id) {
        const updated = await updateCompany(company.id, companyData);
        success = !!updated;
      } else {
        const created = await createCompany({
          id: companyId,
          name: formData.companyName,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
          city: formData.city || undefined,
          country: formData.country || undefined,
          aboutUs: formData.aboutUs || undefined,
          admissionDescription: formData.whoWeAreLookingFor || undefined,
        });
        success = !!created;
        newCompanyId = created?.id;
      }

      if (success) {
        if (newCompanyId) {
          setOverrideCompanyId(newCompanyId);
        }
        setUserEdits({});
        setSaveSuccess(true);
        setEditMode(false);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    },
    [
      formData,
      company,
      companyId,
      updateCompany,
      createCompany,
      clearError,
      setEditMode,
    ]
  );

  const toggleEditMode = useCallback(() => {
    setEditMode(!isEditMode);
    clearError();
  }, [clearError, isEditMode, setEditMode]);

  const cancelEdit = useCallback(() => {
    setEditMode(false);
    clearError();
    setUserEdits({});
  }, [clearError, setEditMode]);

  const refreshCompany = useCallback(async () => {
    const id = company?.id ?? companyId;
    if (id) {
      await fetchCompany(id);
    }
  }, [company?.id, companyId, fetchCompany]);

  // Transform job responses to frontend Job type and filter for published
  const jobPosts = useMemo(() => {
    return jobResponses.filter((job) => job.published).map(toJob);
  }, [jobResponses]);

  const sortedActivities = [...mockActivities].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return {
    // View state
    isEditMode,
    isLoading: isLoading || isLoadingJobs,
    isSaving,
    saveSuccess,
    error: apiError,
    fieldErrors,
    resourceNotFound,

    // Data
    formData,
    company,
    companyId: company?.id ?? companyId,
    city,
    country,
    displayName,
    initials,
    jobPosts,
    activities: sortedActivities,

    // Actions
    updateFormField,
    handleSaveProfile,
    toggleEditMode,
    cancelEdit,
    refreshCompany,
    clearError,
    setCompanyId: setOverrideCompanyId,
  };
}
