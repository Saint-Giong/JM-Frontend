'use client';

import { getGreeting } from '@/lib';
import {
  activeJobs,
  dashboardStats,
  recentApplications,
} from '@/mocks/dashboard';
import { useAuthStore } from '@/stores';

export function useDashboard() {
  const { user } = useAuthStore();

  const displayName =
    user?.companyName || user?.email?.split('@')[0] || 'there';
  const greeting = getGreeting();

  return {
    displayName,
    greeting,
    stats: dashboardStats,
    recentApplications,
    activeJobs,
  };
}
