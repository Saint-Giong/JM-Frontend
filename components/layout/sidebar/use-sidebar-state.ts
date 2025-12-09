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

function getDisplayName(user: { email: string; companyName?: string }): string {
  if (user.companyName) return user.companyName;
  return user.email.split('@')[0];
}

export function useSidebarState() {
  const router = useRouter();
  const { open, toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const displayName = user ? getDisplayName(user) : 'Guest';
  const userEmail = user?.email ?? 'Not signed in';
  const initials = user ? getInitials(displayName) : 'G';

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
