'use client';

import type { Applicant, ApplicantMark } from '@/components/applicant';
import { ApplicantCard } from '@/components/applicant';
import { Button, Skeleton } from '@saint-giong/bamboo-ui';
import { Users } from 'lucide-react';

interface ResultsSectionProps {
  applicants: Applicant[];
  totalCount: number;
  selectedApplicant: Applicant | null;
  onSelectApplicant: (applicant: Applicant) => void;
  onMarkApplicant: (id: string, mark: ApplicantMark) => void;
  onResetFilters: () => void;
  children?: React.ReactNode; // For pagination
  disableScroll?: boolean; // For mobile where parent scrolls
  isLoading?: boolean;
}

function ApplicantCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResultsSection({
  applicants,
  totalCount,
  selectedApplicant,
  onSelectApplicant,
  onMarkApplicant,
  onResetFilters,
  children,
  disableScroll,
  isLoading,
}: ResultsSectionProps) {
  return (
    <main
      className={`flex flex-1 flex-col ${disableScroll ? '' : 'overflow-hidden'} ${
        selectedApplicant ? 'lg:w-1/2' : 'w-full'
      }`}
    >
      <div className={disableScroll ? '' : 'flex-1 overflow-y-auto'}>
        <div className="p-3 sm:p-4 md:p-6">
          {/* Results Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-lg">Best match</h2>
            <span className="text-muted-foreground text-sm">
              {isLoading ? (
                <Skeleton className="inline-block h-4 w-16" />
              ) : (
                <>
                  {totalCount} result{totalCount !== 1 ? 's' : ''}
                </>
              )}
            </span>
          </div>

          {/* Loading State */}
          {isLoading && applicants.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <ApplicantCardSkeleton key={i} />
              ))}
            </div>
          ) : applicants.length === 0 ? (
            /* Empty State */
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
            /* Results List */
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
              {/* Loading more indicator */}
              {isLoading && applicants.length > 0 && (
                <div className="space-y-3 pt-2">
                  <ApplicantCardSkeleton />
                  <ApplicantCardSkeleton />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pagination slot */}
      {children}
    </main>
  );
}
