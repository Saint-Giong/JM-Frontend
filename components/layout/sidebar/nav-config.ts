import {
  Bell,
  Briefcase,
  CreditCard,
  Home,
  Search,
  Settings,
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
    badge: 2,
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
];
