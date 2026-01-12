'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { createSubscriptionProfile, getSubscriptionStatus } from '@/lib/api';
import {
  createSearchProfile,
  deleteSearchProfile,
  getSearchProfilesByCompany,
} from '@/lib/api/discovery/discovery.service';
import type { SearchProfile } from '@/lib/api/discovery/discovery.types';
import { getAllSkillTags } from '@/lib/api/tag/tag.service';
import type { SkillTag } from '@/lib/api/tag/tag.types';
import { useAuthStore, useSubscriptionStore } from '@/stores';

export interface SearchProfileFormData {
  name: string;
  skillIds: number[];
  employmentTypes: string[];
  country: string;
  minSalary: string;
  maxSalary: string;
  education: string[];
}

const initialFormData: SearchProfileFormData = {
  name: '',
  skillIds: [],
  employmentTypes: [],
  country: '',
  minSalary: '',
  maxSalary: '',
  education: [],
};

export function useSubscription() {
  const {
    isPremium,
    setIsPremium,
    customerId,
    setCustomerId,
    setSubscriptionProfileId,
    hasHydrated,
  } = useSubscriptionStore();
  const { companyId, userEmail } = useAuthStore();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchProfiles, setSearchProfiles] = useState<SearchProfile[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] =
    useState<SearchProfileFormData>(initialFormData);
  const [availableSkillTags, setAvailableSkillTags] = useState<SkillTag[]>([]);

  // Fetch subscription status on mount (only after hydration)
  useEffect(() => {
    async function fetchSubscriptionStatus() {
      // Wait for hydration to complete before fetching
      if (!hasHydrated) {
        return;
      }

      if (!companyId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getSubscriptionStatus(companyId);
        // Handle both wrapped and unwrapped responses
        const status =
          response.data?.status ??
          (response as unknown as { status: string }).status;
        setIsPremium(status === 'ACTIVE');
      } catch (error) {
        // If 404 or other error, don't overwrite persisted value
        // Only log the error - the persisted isPremium state will be used
        console.log('[Subscription] Status fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscriptionStatus();
  }, [companyId, setIsPremium, hasHydrated]);

  // Fetch search profiles for the company (only when premium)
  useEffect(() => {
    async function fetchSearchProfiles() {
      if (!hasHydrated || !companyId || !isPremium) {
        return;
      }

      try {
        const profiles = await getSearchProfilesByCompany(companyId);
        setSearchProfiles(profiles);
      } catch (error) {
        console.error('[SearchProfiles] Failed to fetch profiles:', error);
      }
    }

    fetchSearchProfiles();
  }, [companyId, isPremium, hasHydrated]);

  // Fetch available skill tags for the form
  useEffect(() => {
    async function fetchSkillTags() {
      try {
        const result = await getAllSkillTags({ size: 100 });
        setAvailableSkillTags(result.content);
      } catch (error) {
        console.error('[SkillTags] Failed to fetch skill tags:', error);
      }
    }

    fetchSkillTags();
  }, []);

  // Handle Stripe checkout success/cancel
  useEffect(() => {
    async function handleCheckoutResult() {
      const success = searchParams.get('success');
      const canceled = searchParams.get('canceled');
      const sessionId = searchParams.get('session_id');

      if (success === 'true' && sessionId && companyId) {
        // Payment successful - create subscription profile in backend
        try {
          const profile = await createSubscriptionProfile({ companyId });
          // Handle both wrapped and unwrapped responses
          const subscriptionId =
            profile.data?.subscriptionId ??
            (profile as unknown as { id: string }).id;
          setSubscriptionProfileId(subscriptionId);
          setIsPremium(true);
        } catch (error) {
          console.error('[Subscription] Failed to create profile:', error);
          // Optimistically set premium anyway as Stripe payment succeeded
          setIsPremium(true);
        }
      } else if (canceled === 'true') {
        // User canceled checkout
        console.log('Checkout canceled');
      }
    }

    handleCheckoutResult();
  }, [searchParams, companyId, setIsPremium, setSubscriptionProfileId]);

  const handleUpgrade = useCallback(async () => {
    if (!companyId || !userEmail) {
      console.error('Company ID or email not available');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId,
          email: userEmail,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url, customerId: newCustomerId } = await response.json();

      if (url) {
        // Store customer ID if provided
        if (newCustomerId) {
          setCustomerId(newCustomerId);
        }
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setIsProcessing(false);
      // You might want to show an error toast here
    }
  }, [companyId, userEmail, setCustomerId]);

  const handleManageBilling = useCallback(async () => {
    if (!customerId) {
      console.error('Customer ID not available');
      return;
    }

    try {
      const response = await fetch('/api/stripe/billing-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || 'Failed to create billing portal session'
        );
      }

      const { url } = await response.json();

      if (url) {
        // Redirect to Stripe Billing Portal
        window.location.href = url;
      }
    } catch (error) {
      console.error('Billing portal error:', error);
      // You might want to show an error toast here
    }
  }, [customerId]);

  const toggleArrayItem = useCallback(
    <K extends keyof SearchProfileFormData>(field: K, item: string) => {
      setFormData((prev) => {
        const array = prev[field] as string[];
        return {
          ...prev,
          [field]: array.includes(item)
            ? array.filter((i) => i !== item)
            : [...array, item],
        };
      });
    },
    []
  );

  const setFormField = useCallback(
    <K extends keyof SearchProfileFormData>(
      field: K,
      value: SearchProfileFormData[K]
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  const handleSaveProfile = useCallback(async () => {
    if (!formData.name.trim() || !companyId) return;

    setIsSaving(true);

    try {
      // Map employment types to BitSet indices
      const employmentTypeMap: Record<string, number> = {
        'Full-time': 0,
        'Part-time': 1,
        Fresher: 2,
        Internship: 3,
        Contract: 4,
      };

      // Map education levels to degree type
      const _degreeMap: Record<string, 'BACHELOR' | 'MASTER' | 'DOCTORATE'> = {
        Bachelor: 'BACHELOR',
        Master: 'MASTER',
        Doctorate: 'DOCTORATE',
      };

      // Get highest degree from selected education
      const highestDegree = formData.education.includes('Doctorate')
        ? 'DOCTORATE'
        : formData.education.includes('Master')
          ? 'MASTER'
          : formData.education.includes('Bachelor')
            ? 'BACHELOR'
            : null;

      const newProfile = await createSearchProfile({
        companyId,
        salaryMin: formData.minSalary ? Number(formData.minSalary) : null,
        salaryMax: formData.maxSalary ? Number(formData.maxSalary) : null,
        highestDegree,
        employmentType: formData.employmentTypes
          .map((type) => employmentTypeMap[type])
          .filter((idx) => idx !== undefined),
        country: formData.country || null,
        skillTags: formData.skillIds,
      });

      setSearchProfiles((prev) => [...prev, newProfile]);
      setIsCreating(false);
      resetForm();
    } catch (error) {
      console.error('[SearchProfiles] Failed to create profile:', error);
    } finally {
      setIsSaving(false);
    }
  }, [formData, resetForm, companyId]);

  const handleDeleteProfile = useCallback(async (profileId: string) => {
    try {
      await deleteSearchProfile(profileId);
      setSearchProfiles((prev) =>
        prev.filter((p) => p.profileId !== profileId)
      );
    } catch (error) {
      console.error('[SearchProfiles] Failed to delete profile:', error);
    }
  }, []);

  const startCreating = useCallback(() => {
    setIsCreating(true);
  }, []);

  const cancelCreating = useCallback(() => {
    setIsCreating(false);
    resetForm();
  }, [resetForm]);

  return {
    // State
    isPremium,
    isProcessing,
    isLoading,
    searchProfiles,
    isCreating,
    isSaving,
    formData,
    availableSkillTags,

    // Actions
    handleUpgrade,
    handleManageBilling,
    toggleArrayItem,
    setFormField,
    handleSaveProfile,
    handleDeleteProfile,
    startCreating,
    cancelCreating,
  };
}
