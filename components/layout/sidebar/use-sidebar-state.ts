'use client';

import { useAuthStore, useNotificationStore } from '@/stores';
import { useSidebar, useTheme } from '@saint-giong/bamboo-ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function useSidebarState() {
  const router = useRouter();
  const { open, toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, companyProfile, userEmail, logout } = useAuthStore();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Get display name from company profile, fallback to "Company"
  const displayName = companyProfile?.name || 'Company';
  // Get email from auth state
  const displayEmail =
    userEmail || (isAuthenticated ? 'Authenticated' : 'Not signed in');
  const initials = getInitials(displayName);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return {
    open,
    toggleSidebar,
    theme,
    cycleTheme,
    mounted,
    displayName,
    userEmail: displayEmail,
    initials,
    handleLogout,
    router,
    unreadCount,
  };
}
