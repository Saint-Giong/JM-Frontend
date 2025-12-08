'use client';

import { DEGREE_LABELS } from '@/lib/constants/education';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  ScrollArea,
  Separator,
} from '@saint-giong/bamboo-ui';
import { Clock, X } from 'lucide-react';
import { FavoriteButton } from './favorite-button';
import type { Applicant, ApplicantMark } from './types';
import { WarningButton } from './warning-button';

interface ApplicantDetailPanelProps {
  applicant: Applicant | null;
  onClose: () => void;
  onMark?: (id: string, mark: ApplicantMark) => void;
  hideCloseButton?: boolean;
}

export function ApplicantDetailPanel({
  applicant,
  onClose,
  onMark,
  hideCloseButton,
}: ApplicantDetailPanelProps) {
  if (!applicant) return null;

  const fullName = `${applicant.firstName} ${applicant.lastName}`;
  const initials = `${applicant.firstName[0]}${applicant.lastName[0]}`;
  const educationSummary = applicant.education[0]
    ? `${DEGREE_LABELS[applicant.education[0].degree]} of ${applicant.education[0].field} (${applicant.education[0].institution})`
    : DEGREE_LABELS[applicant.highestDegree];

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 flex-shrink-0">
            <AvatarImage src={applicant.avatarUrl} alt={fullName} />
            <AvatarFallback className="bg-amber-100 text-amber-800 text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-xl">{fullName}</h2>
                <p className="mt-1 flex items-center gap-1 text-muted-foreground text-sm">
                  <Clock className="h-3.5 w-3.5" />
                  An hour ago
                </p>
              </div>
              {!hideCloseButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex items-center gap-2">
              <FavoriteButton
                isFavorite={applicant.mark === 'favorite'}
                onClick={() =>
                  onMark?.(
                    applicant.id,
                    applicant.mark === 'favorite' ? null : 'favorite'
                  )
                }
              />
              <WarningButton
                hasWarning={applicant.mark === 'warning'}
                onClick={() =>
                  onMark?.(
                    applicant.id,
                    applicant.mark === 'warning' ? null : 'warning'
                  )
                }
              />
              <div className="flex-1" />
              <Button size="sm" variant="outline" className="border-black">
                Inbox
              </Button>
              <Button size="sm">Hire</Button>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-6">
          {/* Info Grid */}
          <div className="space-y-4">
            <InfoRow label="Email" value={applicant.email} />
            <InfoRow label="Phone number" value="(+84) 333 222 111" />
            <InfoRow
              label="Location"
              value={`${applicant.city}, ${applicant.country}`}
            />
            <InfoRow label="Education" value={educationSummary} />
            <InfoRow
              label="Work experience"
              value={
                applicant.workExperience.length === 0
                  ? 'None'
                  : applicant.workExperience[0].title
              }
            />
          </div>

          <Separator />

          {/* Objective Summary */}
          <div>
            <h3 className="mb-2 font-medium text-muted-foreground text-sm">
              Objective summary
            </h3>
            <p className="text-sm leading-relaxed">
              {applicant.objectiveSummary}
            </p>
          </div>

          <Separator />

          {/* Skills */}
          <div>
            <h3 className="mb-3 font-medium text-muted-foreground text-sm">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {applicant.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Work Experience Details */}
          {applicant.workExperience.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="mb-3 font-medium text-muted-foreground text-sm">
                  Work experience
                </h3>
                <div className="space-y-4">
                  {applicant.workExperience.map((exp, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-sm">{exp.title}</h4>
                      <p className="text-muted-foreground text-sm">
                        {exp.company}
                      </p>
                      <p className="mt-0.5 text-muted-foreground text-xs">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </p>
                      <p className="mt-2 text-sm">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Education Details */}
          <Separator />
          <div>
            <h3 className="mb-3 font-medium text-muted-foreground text-sm">
              Education
            </h3>
            <div className="space-y-4">
              {applicant.education.map((edu, index) => (
                <div key={index}>
                  <h4 className="font-medium text-sm">
                    {DEGREE_LABELS[edu.degree]} in {edu.field}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {edu.institution}
                  </p>
                  <p className="mt-0.5 text-muted-foreground text-xs">
                    Graduated {edu.graduationYear}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="w-32 flex-shrink-0 text-muted-foreground text-sm">
        {label}
      </span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
