'use client';

import { Loader2 } from 'lucide-react';
import {
  CreateProfilePrompt,
  ProfileEditForm,
  ProfileView,
  useProfile,
} from './_components';

export default function ProfilePage() {
  const {
    isEditMode,
    isLoading,
    isSaving,
    saveSuccess,
    error,
    fieldErrors,
    formData,
    city,
    country,
    displayName,
    initials,
    jobPosts,
    activities,
    companyId,
    resourceNotFound,
    updateFormField,
    handleSaveProfile,
    cancelEdit,
  } = useProfile();

  // Show loading state while fetching company data
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show create profile prompt when resource is not found
  if (resourceNotFound && !isEditMode) {
    return (
      <CreateProfilePrompt
        formData={formData}
        isSaving={isSaving}
        error={error}
        fieldErrors={fieldErrors}
        onFieldChange={updateFormField}
        onSubmit={handleSaveProfile}
      />
    );
  }

  return (
    <div className="mx-auto max-w-8xl">
      {isEditMode ? (
        <ProfileEditForm
          formData={formData}
          city={city}
          country={country}
          initials={initials}
          isSaving={isSaving}
          saveSuccess={saveSuccess}
          error={error}
          fieldErrors={fieldErrors}
          companyId={companyId}
          onFieldChange={updateFormField}
          onSubmit={handleSaveProfile}
          onCancel={cancelEdit}
        />
      ) : (
        <ProfileView
          formData={formData}
          city={city}
          country={country}
          displayName={displayName}
          initials={initials}
          jobPosts={jobPosts}
          companyId={companyId}
          activities={activities}
        />
      )}
    </div>
  );
}
