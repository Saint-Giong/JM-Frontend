'use client';

import { Button } from '@saint-giong/bamboo-ui';
import { Edit, Eye, Share2, User } from 'lucide-react';

interface ProfileHeaderProps {
  isEditMode: boolean;
  onToggleEdit: () => void;
}

export function ProfileHeader({
  isEditMode,
  onToggleEdit,
}: ProfileHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b px-6 py-4">
      <div className="flex items-center gap-4">
        <User className="h-6 w-6" />
        <h1 className="font-semibold text-2xl">Profile</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2">
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline">View as Applicants</span>
        </Button>
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
        <Button
          variant={isEditMode ? 'outline' : 'default'}
          className="gap-2"
          onClick={onToggleEdit}
        >
          <Edit className="h-4 w-4" />
          <span className="hidden sm:inline">
            {isEditMode ? 'Cancel' : 'Edit'}
          </span>
        </Button>
      </div>
    </header>
  );
}
