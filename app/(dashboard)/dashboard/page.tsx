'use client';

import {
  ActiveJobsCard,
  DashboardHeader,
  QuickActionsGrid,
  RecentApplicationsCard,
  StatsGrid,
  useDashboard,
} from './_components';

export default function DashboardPage() {
  const { displayName, greeting, stats, recentApplications, activeJobs } =
    useDashboard();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DashboardHeader greeting={greeting} displayName={displayName} />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <StatsGrid stats={stats} />

          <div className="grid gap-6 lg:grid-cols-2">
            <RecentApplicationsCard applications={recentApplications} />
            <ActiveJobsCard jobs={activeJobs} />
          </div>

          <QuickActionsGrid />
        </div>
      </main>
    </div>
  );
}
