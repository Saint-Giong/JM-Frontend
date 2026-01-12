'use client';

import { Button } from '@saint-giong/bamboo-ui';
import { Edit, Eye, Share2 } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/common/breadcrumb';

interface ProfileHeaderProps {
  isEditMode: boolean;
  onToggleEdit: () => void;
}

export function ProfileHeader({
  isEditMode,
  onToggleEdit,
}: ProfileHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b px-9 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {isEditMode ? (
              <button
                type="button"
                onClick={onToggleEdit}
                className="text-muted-foreground hover:underline"
              >
                Profile
              </button>
            ) : (
              <BreadcrumbPage>Profile</BreadcrumbPage>
            )}
          </BreadcrumbItem>
          {isEditMode && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
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
