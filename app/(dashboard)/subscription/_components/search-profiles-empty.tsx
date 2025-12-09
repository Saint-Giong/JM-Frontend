'use client';

import { Button, Card, CardContent } from '@saint-giong/bamboo-ui';
import { Plus, Search } from 'lucide-react';

interface SearchProfilesEmptyProps {
  onCreateProfile: () => void;
}

export function SearchProfilesEmpty({
  onCreateProfile,
}: SearchProfilesEmptyProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-1 font-semibold text-lg">No search profiles yet</h3>
        <p className="mb-4 text-center text-muted-foreground text-sm">
          Create a profile to automatically match candidates
        </p>
        <Button onClick={onCreateProfile}>
          <Plus className="mr-2 h-4 w-4" />
          Create Profile
        </Button>
      </CardContent>
    </Card>
  );
}
