'use client';

import { getGreeting } from '@/lib';
import { jobPostApi } from '@/lib/api/jobpost/jobpost.service';
import { profileApi } from '@/lib/api/profile/profile.service';
import {
  type ActiveJob,
  dashboardStats,
  type RecentApplication,
} from '@/mocks/dashboard';
import { useEffect, useState } from 'react';

export function useDashboard() {
  const [stats, setStats] = useState(() => {
    const initial = [...dashboardStats];
    // Initialize with placeholders
    if (initial[0]) {
      initial[0] = {
        ...initial[0],
        title: 'Total Jobs',
        value: '-',
        description: 'Active job postings',
        trend: '',
        trendUp: true,
      };
    }
    if (initial[1]) {
      initial[1] = {
        ...initial[1],
        value: '-',
        description: 'Not integrated',
        trend: '',
      };
    }
    if (initial[2]) {
      initial[2] = {
        ...initial[2],
        title: 'Total Companies',
        value: '-',
        description: 'Registered companies',
        trend: '',
        trendUp: true,
      };
    }
    if (initial[3]) {
      initial[3] = {
        ...initial[3],
        value: '-',
        description: 'Not integrated',
        trend: '',
      };
    }
    return initial;
  });

  const [activeJobsList, setActiveJobsList] = useState<ActiveJob[]>([]);
  const [recentAppsList, setRecentAppsList] = useState<RecentApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // With cookie-based auth, company name would come from a profile API
  const displayName = 'there';
  const greeting = getGreeting();

  useEffect(() => {
    async function fetchStats() {
      try {
        const [jobs, profiles] = await Promise.all([
          jobPostApi.getAll(),
          profileApi.getAll(),
        ]);

        setStats((prev) => {
          const newStats = [...prev];

          // Update Total Jobs (index 0)
          if (newStats[0]) {
            newStats[0] = {
              ...newStats[0],
              title: 'Total Jobs',
              value: jobs.length.toString(),
              description: 'Active job postings',
            };
          }

          // Update Total Companies (replacing New Applicants at index 2)
          if (newStats[2]) {
            newStats[2] = {
              ...newStats[2],
              title: 'Total Companies',
              value: profiles.length.toString(),
              description: 'Registered companies',
            };
          }

          return newStats;
        });

        // Map jobs to ActiveJob format
        const mappedJobs: ActiveJob[] = jobs.slice(0, 5).map((job) => {
          const now = new Date();
          const expiry = new Date(job.expiryDate);
          const diffTime = Math.max(0, expiry.getTime() - now.getTime());
          const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return {
            id: job.id,
            title: job.title,
            applications: 0, // Not integrated
            views: 0, // Not integrated
            daysLeft,
          };
        });
        setActiveJobsList(mappedJobs);

        // Clear recent applications as we don't have API
        setRecentAppsList([]);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return {
    displayName,
    greeting,
    stats,
    recentApplications: recentAppsList,
    activeJobs: activeJobsList,
    isLoading,
  };
}
