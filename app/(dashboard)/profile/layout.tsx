'use client';

import { useProfileStore } from '@/stores';
import { ProfileHeader } from './_components';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isEditMode = useProfileStore((state) => state.isEditMode);
  const toggleEditMode = useProfileStore((state) => state.toggleEditMode);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <ProfileHeader isEditMode={isEditMode} onToggleEdit={toggleEditMode} />
      <main className="flex-1 overflow-y-auto px-9 py-6">{children}</main>
    </div>
  );
}
