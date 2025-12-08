'use client';

import type { JobPost } from '@/components/job/types';
import { formatEmploymentTypes, formatJobSalary } from '@/components/job/types';
import { Badge, Separator } from '@saint-giong/bamboo-ui';
import { Briefcase, Calendar, Clock, MapPin, Wallet } from 'lucide-react';

interface JobDetailsContentProps {
  job: JobPost;
}

interface MetaItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function MetaItem({ icon, label, value }: MetaItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}

export function JobDetailsContent({ job }: JobDetailsContentProps) {
  return (
    <div className="flex flex-1 gap-8 p-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Title and Posted Date */}
        <div>
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {job.postedAt}
          </p>
        </div>

        {/* Description */}
        <div className="prose prose-sm max-w-none">
          {job.description.split('\n\n').map((paragraph, index) => {
            // Check if paragraph starts with a list marker
            if (paragraph.startsWith('- ')) {
              const items = paragraph
                .split('\n- ')
                .map((item, i) => <li key={i}>{item.replace(/^- /, '')}</li>);
              return (
                <ul key={index} className="list-disc pl-5 space-y-1">
                  {items}
                </ul>
              );
            }
            return (
              <p key={index} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Skills */}
        {job.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="w-72 shrink-0 space-y-6">
        {job.expiryDate && (
          <MetaItem
            icon={<Calendar className="h-5 w-5" />}
            label="Expiry Date"
            value={job.expiryDate}
          />
        )}

        <MetaItem
          icon={<MapPin className="h-5 w-5" />}
          label="Location"
          value={job.location}
        />

        <MetaItem
          icon={<Briefcase className="h-5 w-5" />}
          label="Employment type"
          value={formatEmploymentTypes(job.employmentTypes)}
        />

        <MetaItem
          icon={<Wallet className="h-5 w-5" />}
          label="Salary"
          value={formatJobSalary(job.salary)}
        />

        <Separator />

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 2).map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>
      </aside>
    </div>
  );
}
