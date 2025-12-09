'use client';

import { SidebarMenuButton } from '@saint-giong/bamboo-ui';
import { Monitor, Moon, Sun } from 'lucide-react';

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

interface ThemeToggleProps {
  theme: string | undefined;
  mounted: boolean;
  onCycleTheme: () => void;
}

export function ThemeToggle({
  theme,
  mounted,
  onCycleTheme,
}: ThemeToggleProps) {
  const currentTheme = mounted && theme ? theme : 'system';
  const ThemeIcon =
    themeIcons[currentTheme as keyof typeof themeIcons] || Monitor;

  return (
    <SidebarMenuButton
      onClick={onCycleTheme}
      tooltip={`Theme: ${currentTheme}`}
    >
      <ThemeIcon className="h-4 w-4" />
      <span className="capitalize">{currentTheme} mode</span>
    </SidebarMenuButton>
  );
}
