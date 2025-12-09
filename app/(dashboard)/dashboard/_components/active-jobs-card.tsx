'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@saint-giong/bamboo-ui';
import { ArrowRight, Clock, Eye, Users } from 'lucide-react';
import Link from 'next/link';
import type { ActiveJob } from './types';

interface ActiveJobsCardProps {
  jobs: ActiveJob[];
}

export function ActiveJobsCard({ jobs }: ActiveJobsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Active Jobs</CardTitle>
          <CardDescription>Your currently open job postings</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/jobs">
            Manage jobs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium text-sm">{job.title}</p>
                <div className="flex items-center gap-3 text-muted-foreground text-xs">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {job.applications} applications
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {job.views} views
                  </span>
                </div>
              </div>
              <Badge
                variant={job.daysLeft <= 7 ? 'destructive' : 'outline'}
                className="text-xs"
              >
                <Clock className="mr-1 h-3 w-3" />
                {job.daysLeft}d left
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
