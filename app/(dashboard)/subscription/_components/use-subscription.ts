'use client';

import { type SearchProfile, mockSearchProfiles } from '@/mocks/subscription';
import { useAuthStore, useSubscriptionStore } from '@/stores';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export interface SearchProfileFormData {
  name: string;
  skills: string[];
  employmentTypes: string[];
  country: string;
  minSalary: string;
  maxSalary: string;
  education: string[];
}

const initialFormData: SearchProfileFormData = {
  name: '',
  skills: [],
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
    setSubscriptionId,
  } = useSubscriptionStore();
  const { companyId, userEmail } = useAuthStore();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchProfiles, setSearchProfiles] =
    useState<SearchProfile[]>(mockSearchProfiles);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] =
    useState<SearchProfileFormData>(initialFormData);

  // Handle Stripe checkout success/cancel
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const sessionId = searchParams.get('session_id');

    if (success === 'true' && sessionId) {
      // Payment successful - subscription will be activated via webhook
      // For now, we'll optimistically set premium status
      // In production, you should verify the session and subscription status
      setIsPremium(true);
    } else if (canceled === 'true') {
      // User canceled checkout
      console.log('Checkout canceled');
    }
  }, [searchParams, setIsPremium]);

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
  }, [companyId, userEmail]);

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
    if (!formData.name.trim()) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newProfile: SearchProfile = {
      id: crypto.randomUUID(),
      name: formData.name,
      skills: formData.skills,
      employmentStatus: formData.employmentTypes,
      country: formData.country,
      salaryRange: {
        min: formData.minSalary ? Number(formData.minSalary) : 0,
        max: formData.maxSalary ? Number(formData.maxSalary) : null,
      },
      education: formData.education,
      isActive: true,
      matchCount: 0,
    };

    setSearchProfiles((prev) => [...prev, newProfile]);
    setIsCreating(false);
    resetForm();
    setIsSaving(false);
  }, [formData, resetForm]);

  const handleDeleteProfile = useCallback((id: string) => {
    setSearchProfiles((prev) => prev.filter((p) => p.id !== id));
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
    searchProfiles,
    isCreating,
    isSaving,
    formData,

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
