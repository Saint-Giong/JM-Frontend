'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@saint-giong/bamboo-ui';
import { useState } from 'react';
import type { ApplicantSearchFilters, ApplicantSearchProfile } from './types';

interface SaveProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ApplicantSearchFilters;
  onSave: (
    profile: Omit<ApplicantSearchProfile, 'id' | 'createdAt' | 'updatedAt'>
  ) => void;
}

export function SaveProfileDialog({
  open,
  onOpenChange,
  filters,
  onSave,
}: SaveProfileDialogProps) {
  const [name, setName] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      skills: filters.skills,
      employmentTypes: filters.employmentTypes,
      country:
        filters.location?.type === 'country'
          ? filters.location.value
          : undefined,
      salaryRange: filters.salaryRange,
      education: filters.education,
    });

    setName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Search Profile</DialogTitle>
          <DialogDescription>
            Save your current search filters as a profile for quick access
            later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="profile-name">Profile Name</Label>
            <Input
              id="profile-name"
              placeholder="e.g., Senior Frontend Developer"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
            />
          </div>
          <div className="rounded-md bg-muted p-3 text-sm">
            <p className="mb-2 font-medium">Current Filters:</p>
            <ul className="space-y-1 text-muted-foreground">
              {filters.skills.length > 0 && (
                <li>Skills: {filters.skills.join(', ')}</li>
              )}
              {filters.employmentTypes.length > 0 && (
                <li>Employment: {filters.employmentTypes.join(', ')}</li>
              )}
              {filters.education.length > 0 && (
                <li>Education: {filters.education.join(', ')}</li>
              )}
              {filters.location?.value && (
                <li>
                  {filters.location.type === 'country' ? 'Country' : 'City'}:{' '}
                  {filters.location.value}
                </li>
              )}
              {filters.salaryRange && (
                <li>
                  Salary: {filters.salaryRange.min || 0} -{' '}
                  {filters.salaryRange.max || '∞'}{' '}
                  {filters.salaryRange.currency || 'USD'}
                </li>
              )}
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
