'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@saint-giong/bamboo-ui';
import { ChevronDown, FolderOpen, Trash2 } from 'lucide-react';
import type { ApplicantSearchProfile } from './types';

interface SearchProfileSelectorProps {
  profiles: ApplicantSearchProfile[];
  selectedProfile: ApplicantSearchProfile | null;
  onSelectProfile: (profile: ApplicantSearchProfile) => void;
  onDeleteProfile?: (id: string) => void;
  onSaveNew?: () => void;
}

export function SearchProfileSelector({
  profiles,
  selectedProfile,
  onSelectProfile,
  onDeleteProfile,
  onSaveNew,
}: SearchProfileSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FolderOpen className="h-4 w-4" />
          {selectedProfile?.name || 'Select Profile'}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {profiles.length === 0 ? (
          <div className="px-2 py-4 text-center text-muted-foreground text-sm">
            No saved profiles
          </div>
        ) : (
          profiles.map((profile) => (
            <DropdownMenuItem
              key={profile.id}
              className="flex items-center justify-between"
              onClick={() => onSelectProfile(profile)}
            >
              <div className="flex-1 truncate">
                <div className="font-medium">{profile.name}</div>
                <div className="text-muted-foreground text-xs">
                  {profile.skills.slice(0, 3).join(', ')}
                  {profile.skills.length > 3 && '...'}
                </div>
              </div>
              {onDeleteProfile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProfile(profile.id);
                  }}
                >
                  <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                </Button>
              )}
            </DropdownMenuItem>
          ))
        )}
        {onSaveNew && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSaveNew}>
              + Save current filters as profile
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
