'use client';

import { getGreeting } from '@/lib';
import {
  activeJobs,
  dashboardStats,
  recentApplications,
} from '@/mocks/dashboard';

export function useDashboard() {
  // With cookie-based auth, company name would come from a profile API
  const displayName = 'there';
  const greeting = getGreeting();

  return {
    displayName,
    greeting,
    stats: dashboardStats,
    recentApplications,
    activeJobs,
  };
}
