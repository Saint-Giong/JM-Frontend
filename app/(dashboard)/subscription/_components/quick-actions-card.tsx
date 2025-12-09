'use client';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@saint-giong/bamboo-ui';
import { ChevronRight, Plus, Search } from 'lucide-react';
import Link from 'next/link';

interface QuickActionsCardProps {
  onCreateProfile: () => void;
}

export function QuickActionsCard({ onCreateProfile }: QuickActionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <Button
          variant="outline"
          className="h-auto justify-start gap-3 p-4"
          asChild
        >
          <Link href="/applicant-search">
            <Search className="h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="font-medium">Search Candidates</p>
              <p className="text-muted-foreground text-xs">
                Find matching applicants
              </p>
            </div>
            <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </Link>
        </Button>
        <Button
          variant="outline"
          className="h-auto justify-start gap-3 p-4"
          onClick={onCreateProfile}
        >
          <Plus className="h-5 w-5 text-primary" />
          <div className="text-left">
            <p className="font-medium">Create Search Profile</p>
            <p className="text-muted-foreground text-xs">
              Set up automatic matching
            </p>
          </div>
          <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
        </Button>
      </CardContent>
    </Card>
  );
}
