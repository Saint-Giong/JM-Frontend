'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@saint-giong/bamboo-ui';
import {
  Archive,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  MoreVertical,
  Star,
  UserCheck,
} from 'lucide-react';
import type { ApplicationStatus, JobApplication } from '@/components/job/types';
import { DEGREE_LABELS } from '@/lib/constants/education';

interface ApplicationCardProps {
  application: JobApplication;
  onClick?: () => void;
  onStatusChange?: (status: ApplicationStatus) => void;
  isSelected?: boolean;
}

const STATUS_BADGE_STYLES: Record<ApplicationStatus, string> = {
  pending: 'border-blue-200 bg-blue-50 text-blue-700',
  favorite: 'border-amber-200 bg-amber-50 text-amber-700',
  archived: 'border-gray-200 bg-gray-50 text-gray-700',
  hiring: 'border-green-200 bg-green-50 text-green-700',
};

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: 'Pending',
  favorite: 'Favorited',
  archived: 'Archived',
  hiring: 'Hiring',
};

export function ApplicationCard({
  application,
  onClick,
  onStatusChange,
  isSelected,
}: ApplicationCardProps) {
  const { applicant, status, submittedAt } = application;
  const initials = `${applicant.firstName[0]}${applicant.lastName[0]}`;
  const fullName = `${applicant.firstName} ${applicant.lastName}`;
  const educationSummary = applicant.education[0]
    ? `${DEGREE_LABELS[applicant.education[0].degree]} (${applicant.education[0].field})`
    : DEGREE_LABELS[applicant.highestDegree];

  return (
    <Card
      className={`group cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src={applicant.avatarUrl} alt={fullName} />
            <AvatarFallback className="bg-amber-100 text-amber-800">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="min-w-0 flex-1">
            {/* Header Row */}
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-base">{fullName}</h3>
                <Badge
                  variant="outline"
                  className={`text-xs ${STATUS_BADGE_STYLES[status]}`}
                >
                  {STATUS_LABELS[status]}
                </Badge>
              </div>

              {/* Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuItem
                    onClick={() => onStatusChange?.('favorite')}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    {status === 'favorite'
                      ? 'Remove from favorites'
                      : 'Add to favorites'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange?.('hiring')}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    {status === 'hiring'
                      ? 'Remove from hiring'
                      : 'Move to hiring'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onStatusChange?.('archived')}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    {status === 'archived' ? 'Unarchive' : 'Archive'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Info Row */}
            <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-sm">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {submittedAt}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {applicant.city}, {applicant.country}
              </span>
              <span className="flex items-center gap-1 truncate">
                <GraduationCap className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{educationSummary}</span>
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {applicant.email}
              </span>
            </div>

            {/* Skills Row - Responsive */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Mobile: 2 skills, Tablet: 3 skills, Desktop: 4+ skills */}
              {applicant.skills.slice(0, 2).map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="font-normal text-xs"
                >
                  {skill}
                </Badge>
              ))}
              {applicant.skills.slice(2, 3).map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="hidden font-normal text-xs sm:inline-flex"
                >
                  {skill}
                </Badge>
              ))}
              {applicant.skills.slice(3, 5).map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="hidden font-normal text-xs md:inline-flex"
                >
                  {skill}
                </Badge>
              ))}
              {/* Overflow indicator - adjusts based on visible count */}
              {applicant.skills.length > 2 && (
                <Badge
                  variant="outline"
                  className="font-normal text-xs sm:hidden"
                >
                  +{applicant.skills.length - 2}
                </Badge>
              )}
              {applicant.skills.length > 3 && (
                <Badge
                  variant="outline"
                  className="hidden font-normal text-xs sm:inline-flex md:hidden"
                >
                  +{applicant.skills.length - 3}
                </Badge>
              )}
              {applicant.skills.length > 5 && (
                <Badge
                  variant="outline"
                  className="hidden font-normal text-xs md:inline-flex"
                >
                  +{applicant.skills.length - 5}
                </Badge>
              )}
            </div>

            {/* Cover Letter Preview */}
            {application.coverLetter && (
              <p className="mt-3 line-clamp-2 text-muted-foreground text-sm">
                {application.coverLetter}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
