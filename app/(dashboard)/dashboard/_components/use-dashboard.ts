'use client';

import {
  activeJobs,
  dashboardStats,
  recentApplications,
} from '@/mocks/dashboard';
import { useAuthStore } from '@/stores';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

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
