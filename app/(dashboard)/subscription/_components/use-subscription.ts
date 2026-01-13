'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getSubscriptionStatus } from '@/lib/api';
import {
  createSearchProfile,
  deleteSearchProfile,
  getSearchProfilesByCompany,
} from '@/lib/api/discovery/discovery.service';
import type { SearchProfile } from '@/lib/api/discovery/discovery.types';
import { createPayment } from '@/lib/api/payment/payment-service';
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
  const { isPremium, setIsPremium, customerId, hasHydrated } =
    useSubscriptionStore();
  const { companyId } = useAuthStore();
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

      if (success === 'true' && companyId) {
        // Payment was successful - the backend webhook has already:
        // 1. Updated the payment status to SUCCESSFUL
        // 2. Sent Kafka message to subscription service
        // 3. Subscription service activated the subscription
        // We just need to refresh the subscription status
        console.log('[Subscription] Payment successful, refreshing status...');

        try {
          const response = await getSubscriptionStatus(companyId);
          const status =
            response.data?.status ??
            (response as unknown as { status: string }).status;

          if (status === 'ACTIVE') {
            setIsPremium(true);
            console.log('[Subscription] Subscription is now ACTIVE');
          } else {
            // Subscription might not be activated yet (webhook delay)
            // Set optimistically and it will be verified on next page load
            console.log(
              '[Subscription] Status is',
              status,
              '- setting optimistically'
            );
            setIsPremium(true);
          }
        } catch (error) {
          console.error('[Subscription] Failed to fetch status:', error);
          // Set optimistically since Stripe payment succeeded
          setIsPremium(true);
        }
      } else if (canceled === 'true') {
        // User canceled checkout
        console.log('[Subscription] Checkout canceled');
      }
    }

    handleCheckoutResult();
  }, [searchParams, companyId, setIsPremium]);

  const handleUpgrade = useCallback(async () => {
    if (!companyId) {
      console.error('Company ID not available');
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment via backend - this creates both the payment record
      // AND the Stripe checkout session, so the webhook can find the payment
      const paymentResponse = await createPayment({
        companyId,
        amount: 29, // Premium plan price $29/month
        currency: 'USD',
        method: 'CREDIT_CARD',
      });

      console.log('[Payment] Created payment:', paymentResponse);

      if (paymentResponse.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = paymentResponse.checkoutUrl;
      } else {
        throw new Error('No checkout URL received from payment service');
      }
    } catch (error) {
      console.error('[Payment] Checkout error:', error);
      setIsProcessing(false);
      // You might want to show an error toast here
    }
  }, [companyId]);

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
      // Map to enum
      const employmentTypeMap: Record<
        string,
        'FULL_TIME' | 'PART_TIME' | 'FRESHER' | 'INTERNSHIP' | 'CONTRACT'
      > = {
        'Full-time': 'FULL_TIME',
        'Part-time': 'PART_TIME',
        Fresher: 'FRESHER',
        Internship: 'INTERNSHIP',
        Contract: 'CONTRACT',
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
        employmentTypes: formData.employmentTypes
          .map((type) => employmentTypeMap[type])
          .filter((val) => val !== undefined),
        country: formData.country || null,
        skillTagIds: formData.skillIds,
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
