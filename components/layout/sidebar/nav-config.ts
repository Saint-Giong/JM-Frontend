import {
  Bell,
  Briefcase,
  Building2,
  CreditCard,
  Home,
  Search,
  Settings,
  Terminal,
} from 'lucide-react';

export interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
  disabled?: boolean;
}

export const mainNavItems: NavItem[] = [
  { title: 'Dashboard', icon: Home, href: '/dashboard', disabled: false },
  {
    title: 'Notifications',
    icon: Bell,
    href: '/notifications',
    disabled: false,
  },
  {
    title: 'Companies',
    icon: Building2,
    href: '/companies',
    disabled: false,
  },
];

export const recruitmentItems: NavItem[] = [
  { title: 'Jobs', icon: Briefcase, href: '/jobs', disabled: false },
  {
    title: 'Applicant Search',
    icon: Search,
    href: '/applicant-search',
    disabled: false,
  },
];

export const systemItems: NavItem[] = [
  {
    title: 'Subscription',
    icon: CreditCard,
    href: '/subscription',
    disabled: false,
  },
  { title: 'Settings', icon: Settings, href: '/settings', disabled: false },
  { title: 'Dev Tools', icon: Terminal, href: '/admin', disabled: false },
];
