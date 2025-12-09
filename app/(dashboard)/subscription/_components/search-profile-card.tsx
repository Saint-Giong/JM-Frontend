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
import { cn } from '@saint-giong/bamboo-ui/utils';
import {
  ArrowRight,
  Bell,
  Filter,
  Globe,
  GraduationCap,
  Trash2,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import type { SearchProfile } from './types';

interface SearchProfileCardProps {
  profile: SearchProfile;
  onDelete: (id: string) => void;
}

export function SearchProfileCard({
  profile,
  onDelete,
}: SearchProfileCardProps) {
  return (
    <Card className="group transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base">{profile.name}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1.5">
              <Bell className="h-3.5 w-3.5" />
              <span className="font-medium text-primary">
                {profile.matchCount}
              </span>{' '}
              matches found
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Badge
              variant={profile.isActive ? 'default' : 'secondary'}
              className={cn(
                'text-xs',
                profile.isActive && 'bg-green-500 hover:bg-green-600'
              )}
            >
              {profile.isActive ? 'Active' : 'Paused'}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              onClick={() => onDelete(profile.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Skills */}
        {profile.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {profile.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
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
          {profile.employmentStatus.length > 0 && (
            <p className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              {profile.employmentStatus.length > 2
                ? `${profile.employmentStatus.length} types`
                : profile.employmentStatus.join(', ')}
            </p>
          )}
          {(profile.salaryRange.min > 0 || profile.salaryRange.max) && (
            <p className="flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5" />${profile.salaryRange.min}
              {profile.salaryRange.max ? `-$${profile.salaryRange.max}` : '+'}
            </p>
          )}
          {profile.education.length > 0 && (
            <p className="flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              {profile.education.length > 2
                ? `${profile.education.length} levels`
                : profile.education.join(', ')}
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
