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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@saint-giong/bamboo-ui';
import {
  AlertTriangle,
  Briefcase,
  GraduationCap,
  Mail,
  MapPin,
  Star,
} from 'lucide-react';
import type { Applicant } from './types';

interface ApplicantDetailSheetProps {
  applicant: Applicant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMark?: (id: string, mark: 'favorite' | 'warning' | null) => void;
}

export function ApplicantDetailSheet({
  applicant,
  open,
  onOpenChange,
  onMark,
}: ApplicantDetailSheetProps) {
  if (!applicant) return null;

  const fullName = `${applicant.firstName} ${applicant.lastName}`;
  const initials = `${applicant.firstName[0]}${applicant.lastName[0]}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full p-0 sm:max-w-lg">
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={applicant.avatarUrl} alt={fullName} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-xl">{fullName}</SheetTitle>
              <p className="mt-1 text-muted-foreground text-sm">
                {applicant.workExperience[0]?.title ||
                  'Looking for opportunities'}
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant={
                    applicant.mark === 'favorite' ? 'default' : 'outline'
                  }
                  onClick={() =>
                    onMark?.(
                      applicant.id,
                      applicant.mark === 'favorite' ? null : 'favorite'
                    )
                  }
                >
                  <Star
                    className={`mr-1 h-4 w-4 ${applicant.mark === 'favorite' ? 'fill-current' : ''}`}
                  />
                  Favorite
                </Button>
                <Button
                  size="sm"
                  variant={
                    applicant.mark === 'warning' ? 'destructive' : 'outline'
                  }
                  onClick={() =>
                    onMark?.(
                      applicant.id,
                      applicant.mark === 'warning' ? null : 'warning'
                    )
                  }
                >
                  <AlertTriangle className="mr-1 h-4 w-4" />
                  Warning
                </Button>
              </div>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6 px-6 pb-6">
            {/* Basic Info */}
            <section>
              <h3 className="mb-3 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                Contact Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${applicant.email}`}
                    className="hover:underline"
                  >
                    {applicant.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {applicant.city}, {applicant.country}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>{DEGREE_LABELS[applicant.highestDegree]} Degree</span>
                </div>
              </div>
            </section>

            <Separator />

            {/* Objective Summary */}
            <section>
              <h3 className="mb-3 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                Objective Summary
              </h3>
              <p className="text-sm leading-relaxed">
                {applicant.objectiveSummary}
              </p>
            </section>

            <Separator />

            {/* Skills */}
            <section>
              <h3 className="mb-3 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {applicant.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>

            <Separator />

            {/* Work Experience */}
            <section>
              <h3 className="mb-3 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                Work Experience
              </h3>
              {applicant.workExperience.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No work experience
                </p>
              ) : (
                <div className="space-y-4">
                  {applicant.workExperience.map((exp, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="mt-1 flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{exp.title}</h4>
                        <p className="text-muted-foreground text-sm">
                          {exp.company}
                        </p>
                        <p className="mt-0.5 text-muted-foreground text-xs">
                          {exp.startDate} - {exp.endDate || 'Present'}
                        </p>
                        <p className="mt-2 text-sm">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <Separator />

            {/* Education */}
            <section>
              <h3 className="mb-3 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                Education
              </h3>
              <div className="space-y-4">
                {applicant.education.map((edu, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
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
                  </div>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
