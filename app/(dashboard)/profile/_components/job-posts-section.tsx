'use client';

import { Badge, Button, Card, CardContent } from '@saint-giong/bamboo-ui';
import {
  Briefcase,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  Wallet,
} from 'lucide-react';
import type { JobPost } from './types';

interface JobPostsSectionProps {
  jobPosts: JobPost[];
}

export function JobPostsSection({ jobPosts }: JobPostsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2 hover:opacity-70"
        >
          <h3 className="font-semibold text-xl">
            Job Posts ({jobPosts.length})
          </h3>
          <ChevronRight className="h-5 w-5" />
        </button>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Job
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobPosts.map((job) => (
          <Card
            key={job.id}
            className="cursor-pointer transition-shadow hover:shadow-md"
          >
            <CardContent className="space-y-4 p-5">
              <h4 className="font-semibold text-lg">{job.title}</h4>
              <p className="line-clamp-3 text-muted-foreground text-sm">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="font-normal">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{job.postedAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span>{job.salary}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
