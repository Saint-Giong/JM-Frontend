'use client';

import {
  ProfileEditForm,
  ProfileHeader,
  ProfileView,
  useProfile,
} from './_components';

export default function ProfilePage() {
  const {
    isEditMode,
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
    companyId,
    updateFormField,
    handleSaveProfile,
    toggleEditMode,
    cancelEdit,
  } = useProfile();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <ProfileHeader isEditMode={isEditMode} onToggleEdit={toggleEditMode} />
      <main className="flex-1 overflow-y-auto px-9 py-6">
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
            />
          )}
        </div>
      </main>
    </div>
  );
}
