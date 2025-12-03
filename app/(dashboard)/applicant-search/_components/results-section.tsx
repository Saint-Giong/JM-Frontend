'use client';

import type { Applicant, ApplicantMark } from '@/components/applicant';
import { ApplicantCard } from '@/components/applicant';
import { Button, ScrollArea } from '@saint-giong/bamboo-ui';
import { Users } from 'lucide-react';

interface ResultsSectionProps {
  applicants: Applicant[];
  totalCount: number;
  selectedApplicant: Applicant | null;
  onSelectApplicant: (applicant: Applicant) => void;
  onMarkApplicant: (id: string, mark: ApplicantMark) => void;
  onResetFilters: () => void;
  children?: React.ReactNode; // For pagination
}

export function ResultsSection({
  applicants,
  totalCount,
  selectedApplicant,
  onSelectApplicant,
  onMarkApplicant,
  onResetFilters,
  children,
}: ResultsSectionProps) {
  return (
    <main
      className={`flex h-[calc(100vh-8.375rem)] flex-1 flex-col overflow-y-auto ${
        selectedApplicant ? 'w-1/2' : 'w-full'
      }`}
    >
      <ScrollArea className="flex-1">
        <div className="p-6">
          {/* Results Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-lg">Best match</h2>
            <span className="text-muted-foreground text-sm">
              {totalCount} result{totalCount !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Results List */}
          {applicants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 font-semibold text-lg">
                No applicants found
              </h3>
              <p className="max-w-sm text-muted-foreground">
                Try adjusting your search filters to find more candidates.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={onResetFilters}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {applicants.map((applicant) => (
                <ApplicantCard
                  key={applicant.id}
                  applicant={applicant}
                  onClick={() => onSelectApplicant(applicant)}
                  onMark={(mark) => onMarkApplicant(applicant.id, mark)}
                  isSelected={selectedApplicant?.id === applicant.id}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Pagination slot */}
      {children}
    </main>
  );
}
