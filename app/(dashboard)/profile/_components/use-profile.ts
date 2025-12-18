'use client';

import { useCompany } from '@/hooks';
import { mockActivities } from '@/mocks/activities';
import { mockJobs } from '@/mocks/jobs';
import { useAuthStore } from '@/stores';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const { user, updateProfile } = useAuthStore();
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

  const [isEditMode, setIsEditMode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Track user edits separately from company data
  const [userEdits, setUserEdits] = useState<Partial<ProfileFormData>>({});

  // Compute form data: company data as base, with user edits overlaid
  const baseFormData = useMemo<ProfileFormData>(() => {
    if (company) {
      return fromCompany(company, {
        website: '',
        email: user?.email ?? '',
      });
    }
    return {
      companyName: user?.companyName ?? '',
      website: '',
      aboutUs: '',
      whoWeAreLookingFor: '',
      address: user?.address ?? '',
      city: user?.city ?? '',
      country: user?.country ?? '',
      phone: user?.phoneNumber ?? '',
      email: user?.email ?? '',
    };
  }, [
    company,
    user?.companyName,
    user?.address,
    user?.city,
    user?.country,
    user?.phoneNumber,
    user?.email,
  ]);

  // Merge base data with user edits
  const formData = useMemo<ProfileFormData>(
    () => ({ ...baseFormData, ...userEdits }),
    [baseFormData, userEdits]
  );

  // Load company data on mount if user has companyId
  useEffect(() => {
    const companyId = user?.companyId;
    if (companyId) {
      fetchCompany(companyId);
    }
  }, [user?.companyId, fetchCompany]);

  const city = formData.city || user?.city || '';
  const country = formData.country || user?.country || '';
  const displayName = formData.companyName || 'Company Name';
  const initials = getInitials(displayName);
  const companyId = company?.id ?? user?.companyId;

  // Loading state combines all API states
  const isSaving = isCreating || isUpdating;

  // Track initialization state to prevent flash of stale content
  // - If user has no companyId, we're immediately initialized (no fetch needed)
  // - If user has companyId, we need to wait for fetch to complete
  const [isInitialized, setIsInitialized] = useState(!user?.companyId);

  // Handle fetch completion
  useEffect(() => {
    // If no companyId, we're already initialized
    if (!user?.companyId) {
      setIsInitialized(true);
      return;
    }

    // Wait for loading to complete
    if (isLoadingCompany) {
      return;
    }

    // Loading is complete - determine result
    if (company) {
      // Successfully loaded company
      setIsInitialized(true);
    } else if (apiError) {
      // Fetch failed (404 or other error)
      setIsInitialized(true);
      clearError(); // Clear the 404 error - it's expected
    }
  }, [user?.companyId, isLoadingCompany, company, apiError, clearError]);

  // isLoading: true while we're still determining what to show
  const isLoading = !isInitialized || isLoadingCompany;

  // Resource not found: user has no company to display
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
        // Update existing company (company was successfully fetched)
        const updated = await updateCompany(company.id, companyData);
        success = !!updated;
      } else {
        // Create new company - either user never had one, or the referenced company doesn't exist
        // This handles the case where user.companyId points to a non-existent company (404)
        const created = await createCompany({
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
        // Update local auth store with company ID and profile data
        updateProfile({
          companyId: newCompanyId || user?.companyId,
          companyName: formData.companyName || undefined,
          address: formData.address || undefined,
          city: formData.city || undefined,
          country: formData.country || undefined,
          phoneNumber: formData.phone || undefined,
        });

        // Clear user edits after successful save
        setUserEdits({});
        setSaveSuccess(true);
        setIsEditMode(false);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    },
    [
      formData,
      company,
      user,
      updateCompany,
      createCompany,
      updateProfile,
      clearError,
    ]
  );

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
    clearError();
  }, [clearError]);

  const cancelEdit = useCallback(() => {
    setIsEditMode(false);
    clearError();
    // Reset user edits to revert to base company data
    setUserEdits({});
  }, [clearError]);

  const refreshCompany = useCallback(async () => {
    const id = company?.id ?? user?.companyId;
    if (id) {
      await fetchCompany(id);
    }
  }, [company?.id, user?.companyId, fetchCompany]);

  const sortedActivities = [...mockActivities].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return {
    // View state
    isEditMode,
    isLoading,
    isSaving,
    saveSuccess,
    error: apiError,
    fieldErrors,
    resourceNotFound,

    // Data
    formData,
    company,
    companyId,
    city,
    country,
    displayName,
    initials,
    jobPosts: mockJobs.filter((job) => job.status === 'published'),
    activities: sortedActivities,

    // Actions
    updateFormField,
    handleSaveProfile,
    toggleEditMode,
    cancelEdit,
    refreshCompany,
    clearError,
  };
}
