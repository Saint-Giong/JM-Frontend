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
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { RecentApplication } from './types';

interface RecentApplicationsCardProps {
  applications: RecentApplication[];
}

export function RecentApplicationsCard({
  applications,
}: RecentApplicationsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>
            Latest candidates who applied to your jobs
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/jobs">
            View all
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className="flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="font-medium text-sm">
                  {application.applicantName}
                </p>
                <p className="text-muted-foreground text-xs">
                  Applied for {application.jobTitle}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {application.status === 'new' && (
                  <Badge variant="default" className="bg-green-500 text-xs">
                    New
                  </Badge>
                )}
                <span className="text-muted-foreground text-xs">
                  {application.appliedAt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
