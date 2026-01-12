'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@saint-giong/bamboo-ui';
import {
  ArrowRight,
  Bell,
  Filter,
  Globe,
  GraduationCap,
  Trash2,
  Wallet,
} from 'lucide-react';
import type { SearchProfile } from '@/lib/api/discovery/discovery.types';
import Link from 'next/link';

// Employment type index to label mapping
const EMPLOYMENT_TYPE_LABELS: Record<number, string> = {
  0: 'Full-time',
  1: 'Part-time',
  2: 'Fresher',
  3: 'Internship',
  4: 'Contract',
};

// Degree type to label mapping
const DEGREE_LABELS: Record<string, string> = {
  BACHELOR: 'Bachelor',
  MASTER: 'Master',
  DOCTORATE: 'Doctorate',
};

interface SearchProfileCardProps {
  profile: SearchProfile;
  onDelete: (profileId: string) => void;
}

export function SearchProfileCard({
  profile,
  onDelete,
}: SearchProfileCardProps) {
  // Convert employment type indices to labels
  const employmentLabels = profile.employmentType
    .map((idx) => EMPLOYMENT_TYPE_LABELS[idx])
    .filter(Boolean);

  // Get degree label
  const degreeLabel = profile.highestDegree
    ? DEGREE_LABELS[profile.highestDegree]
    : null;

  return (
    <Card className="group transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base">
              {profile.name || 'Untitled Profile'}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1.5">
              <Bell className="h-3.5 w-3.5" />
              <span className="font-medium text-primary">
                {profile.skillTags.length}
              </span>{' '}
              skill filters configured
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Badge
              variant="default"
              className="bg-green-500 text-xs hover:bg-green-600"
            >
              Active
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              onClick={() => onDelete(profile.profileId)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Skill Tags Count */}
        {profile.skillTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {profile.skillTags.length} skill
              {profile.skillTags.length !== 1 ? 's' : ''} selected
            </Badge>
          </div>
        )}

        {/* Details */}
        <div className="grid grid-cols-2 gap-2 text-muted-foreground text-sm">
          {profile.country && (
            <p className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              {profile.country}
            </p>
          )}
          {employmentLabels.length > 0 && (
            <p className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              {employmentLabels.length > 2
                ? `${employmentLabels.length} types`
                : employmentLabels.join(', ')}
            </p>
          )}
          {(profile.salaryMin || profile.salaryMax) && (
            <p className="flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5" />
              {profile.salaryMin ? `$${profile.salaryMin}` : '$0'}
              {profile.salaryMax ? `-$${profile.salaryMax}` : '+'}
            </p>
          )}
          {degreeLabel && (
            <p className="flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              {degreeLabel}
            </p>
          )}
        </div>

        <Separator />

        <Button variant="ghost" size="sm" className="w-full gap-2" asChild>
          <Link href="/applicant-search">
            View Matches
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
