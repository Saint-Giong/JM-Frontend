'use client';

import { useAuthStore } from '@/stores';
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
  const { isAuthenticated, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // With cookie-based auth, we don't have user details on the client
  // These would need to come from a separate profile API call
  const displayName = 'Company';
  const userEmail = isAuthenticated ? 'Authenticated' : 'Not signed in';
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
    userEmail,
    initials,
    handleLogout,
    router,
  };
}
