'use client';

import { Avatar, AvatarFallback, Separator } from '@saint-giong/bamboo-ui';
import { ExternalLink } from 'lucide-react';
import { JobPostsSection } from './job-posts-section';
import { ProfileSidebar } from './profile-sidebar';
import type { Job, ProfileFormData } from './types';

interface ProfileViewProps {
  formData: ProfileFormData;
  city: string;
  country: string;
  displayName: string;
  initials: string;
  jobPosts: Job[];
  companyId?: string;
}

export function ProfileView({
  formData,
  city,
  country,
  displayName,
  initials,
  jobPosts,
  companyId,
}: ProfileViewProps) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Main Content */}
      <div className="min-w-0 flex-1 space-y-8">
        {/* Company Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Avatar className="h-24 w-24 md:h-32 md:w-32">
            <AvatarFallback className="text-2xl md:text-3xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h2 className="font-serif text-3xl md:text-4xl">{displayName}</h2>
            <p className="text-muted-foreground">
              {city}, {country}
            </p>
            {companyId && (
              <p className="font-mono text-muted-foreground text-xs">
                ID: {companyId}
              </p>
            )}
            {formData.website && (
              <a
                href={`https://${formData.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary text-sm hover:underline"
              >
                {formData.website}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        <Separator />

        {/* Who We Are Looking For */}
        <div className="space-y-3">
          <h3 className="section-heading">Who we are looking for</h3>
          <p className="text-muted-foreground leading-relaxed">
            {formData.whoWeAreLookingFor}
          </p>
        </div>

        <Separator />

        <JobPostsSection jobPosts={jobPosts} />
      </div>

      <ProfileSidebar formData={formData} />
    </div>
  );
}
