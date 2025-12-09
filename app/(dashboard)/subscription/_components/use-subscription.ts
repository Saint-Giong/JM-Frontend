'use client';

import { type SearchProfile, mockSearchProfiles } from '@/mocks/subscription';
import { useCallback, useState } from 'react';

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
  const [isPremium, setIsPremium] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchProfiles, setSearchProfiles] =
    useState<SearchProfile[]>(mockSearchProfiles);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] =
    useState<SearchProfileFormData>(initialFormData);

  const handleUpgrade = useCallback(async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsPremium(true);
    setIsProcessing(false);
  }, []);

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
    toggleArrayItem,
    setFormField,
    handleSaveProfile,
    handleDeleteProfile,
    startCreating,
    cancelCreating,
  };
}
