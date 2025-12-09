'use client';

import { Card, CardContent } from '@saint-giong/bamboo-ui';
import { Plus, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';

const quickActions = [
  {
    href: '/jobs/new',
    icon: Plus,
    title: 'Create Job Post',
    description: 'Post a new job opening',
  },
  {
    href: '/applicant-search',
    icon: Search,
    title: 'Search Candidates',
    description: 'Find matching applicants',
  },
  {
    href: '/subscription',
    icon: Sparkles,
    title: 'Premium Features',
    description: 'Unlock advanced tools',
  },
];

export function QuickActionsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {quickActions.map((action) => (
        <Card
          key={action.href}
          className="cursor-pointer transition-shadow hover:shadow-md"
        >
          <Link href={action.href}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <action.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{action.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {action.description}
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}
