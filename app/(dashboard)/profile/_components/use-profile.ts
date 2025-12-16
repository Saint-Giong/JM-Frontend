'use client';

import { mockActivities } from '@/mocks/activities';
import { mockJobs } from '@/mocks/jobs';
import { defaultProfileContent } from '@/mocks/profile';
import { useAuthStore } from '@/stores';
import { useCallback, useState } from 'react';
import type { ProfileFormData } from './types';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function useProfile() {
  const { user, updateProfile } = useAuthStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    companyName: user?.companyName ?? 'Saint Giong',
    website: 'www.saintgiong.com',
    aboutUs: defaultProfileContent.aboutUs,
    whoWeAreLookingFor: defaultProfileContent.whoWeAreLookingFor,
    address: user?.address ?? '702 Nguyen Van Linh Boulevard, Tan Hung Ward',
    phone: user?.phoneNumber ?? '111 222 3333',
    email: user?.email ?? 'example@email.com',
  });

  const city = user?.city ?? 'Ho Chi Minh City';
  const country = user?.country ?? 'Vietnam';
  const displayName = formData.companyName || 'Company Name';
  const initials = getInitials(displayName);

  const updateFormField = useCallback(
    <K extends keyof ProfileFormData>(field: K, value: ProfileFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSaveProfile = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      setSaveSuccess(false);

      await new Promise((resolve) => setTimeout(resolve, 500));

      updateProfile({
        companyName: formData.companyName || undefined,
        address: formData.address || undefined,
        phoneNumber: formData.phone || undefined,
      });

      setIsSaving(false);
      setSaveSuccess(true);
      setIsEditMode(false);

      setTimeout(() => setSaveSuccess(false), 2000);
    },
    [formData, updateProfile]
  );

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
  }, []);

  const cancelEdit = useCallback(() => {
    setIsEditMode(false);
  }, []);

  const sortedActivities = [...mockActivities].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return {
    isEditMode,
    isSaving,
    saveSuccess,
    formData,
    city,
    country,
    displayName,
    initials,
    jobPosts: mockJobs.filter((job) => job.status === 'published'),
    activities: sortedActivities,
    updateFormField,
    handleSaveProfile,
    toggleEditMode,
    cancelEdit,
  };
}
