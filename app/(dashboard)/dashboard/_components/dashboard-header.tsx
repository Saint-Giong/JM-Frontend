'use client';

import { Button } from '@saint-giong/bamboo-ui';
import { Bell, Home, Plus } from 'lucide-react';
import Link from 'next/link';

interface DashboardHeaderProps {
  greeting: string;
  displayName: string;
}

export function DashboardHeader({
  greeting,
  displayName,
}: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b px-6 py-4">
      <div className="flex items-center gap-4">
        <Home className="h-6 w-6" />
        <div>
          <h1 className="font-semibold text-2xl">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            {greeting}, {displayName}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/notifications">
            <Bell className="h-4 w-4" />
          </Link>
        </Button>
        <Button size="sm" className="gap-2" asChild>
          <Link href="/jobs/new">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Job</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
