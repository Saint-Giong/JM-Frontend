'use client';

import { Card, CardContent } from '@saint-giong/bamboo-ui';
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
    formData,
    city,
    country,
    displayName,
    initials,
    jobPosts,
    updateFormField,
    handleSaveProfile,
    toggleEditMode,
    cancelEdit,
  } = useProfile();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <ProfileHeader isEditMode={isEditMode} onToggleEdit={toggleEditMode} />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          <Card>
            <CardContent className="p-6 md:p-8">
              {isEditMode ? (
                <ProfileEditForm
                  formData={formData}
                  city={city}
                  country={country}
                  initials={initials}
                  isSaving={isSaving}
                  saveSuccess={saveSuccess}
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
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
