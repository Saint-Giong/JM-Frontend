'use client';

import { DEGREE_LABELS } from '@/lib/constants/education';
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
  AlertTriangle,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  MoreVertical,
  Star,
} from 'lucide-react';
import type { Applicant, ApplicantMark } from './types';

interface ApplicantCardProps {
  applicant: Applicant;
  onClick?: () => void;
  onMark?: (mark: ApplicantMark) => void;
  isSelected?: boolean;
}

export function ApplicantCard({
  applicant,
  onClick,
  onMark,
  isSelected,
}: ApplicantCardProps) {
  const initials = `${applicant.firstName[0]}${applicant.lastName[0]}`;
  const fullName = `${applicant.firstName} ${applicant.lastName}`;
  const educationSummary = applicant.education[0]
    ? `${DEGREE_LABELS[applicant.education[0].degree]} of ${applicant.education[0].field} (${applicant.education[0].institution})`
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
                {applicant.mark === 'favorite' && (
                  <Badge
                    variant="outline"
                    className="border-amber-200 bg-amber-50 text-amber-700 text-xs"
                  >
                    Favorited
                  </Badge>
                )}
                {applicant.mark === 'warning' && (
                  <Badge
                    variant="outline"
                    className="border-orange-200 bg-orange-50 text-orange-700 text-xs"
                  >
                    Warning
                  </Badge>
                )}
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
                  <DropdownMenuItem onClick={() => onMark?.('favorite')}>
                    <Star className="mr-2 h-4 w-4" />
                    {applicant.mark === 'favorite'
                      ? 'Remove favorite'
                      : 'Mark as favorite'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onMark?.('warning')}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    {applicant.mark === 'warning'
                      ? 'Remove warning'
                      : 'Add warning'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onMark?.(null)}>
                    Clear mark
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Info Row */}
            <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-sm">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                An hour ago
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

            {/* Skills Row */}
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              {applicant.skills.slice(0, 4).map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="font-normal text-xs"
                >
                  {skill}
                </Badge>
              ))}
              {applicant.skills.length > 4 && (
                <Badge variant="outline" className="font-normal text-xs">
                  +{applicant.skills.length - 4}
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="line-clamp-2 text-muted-foreground text-sm">
              {applicant.objectiveSummary}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
