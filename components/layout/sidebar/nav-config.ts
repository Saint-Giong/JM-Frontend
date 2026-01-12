import {
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  CreditCard,
  Github,
  Home,
  Info,
  Palette,
  Search,
  Settings,
  Terminal,
  Users,
} from 'lucide-react';

export interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
  disabled?: boolean;
  external?: boolean;
}

// Main navigation - core app pages
export const mainNavItems: NavItem[] = [
  { title: 'Dashboard', icon: Home, href: '/dashboard' },
  { title: 'Notifications', icon: Bell, href: '/notifications' },
];

// Hiring - recruitment-related features
export const hiringItems: NavItem[] = [
  { title: 'Jobs', icon: Briefcase, href: '/jobs' },
  { title: 'Applicants', icon: Search, href: '/applicant-search' },
  { title: 'Companies', icon: Building2, href: '/companies' },
];

// Account - user account management
export const accountItems: NavItem[] = [
  { title: 'Subscription', icon: CreditCard, href: '/subscription' },
  { title: 'Settings', icon: Settings, href: '/settings' },
];

// Resources - external links and documentation
export const resourceItems: NavItem[] = [
  { title: 'About', icon: Info, href: '/about' },
  {
    title: 'Documentation',
    icon: BookOpen,
    href: 'https://docs.jm.saintgiong.ttr.gg',
    external: true,
  },
  {
    title: 'Storybook',
    icon: Palette,
    href: 'https://storybook.saintgiong.ttr.gg',
    external: true,
  },
  {
    title: 'GitHub',
    icon: Github,
    href: 'https://github.com/Saint-Giong/JM-Frontend',
    external: true,
  },
  {
    title: 'Job Applicants',
    icon: Users,
    href: 'https://ja.saintgiong.ttr.gg',
    external: true,
  },
];

// Developer tools - admin/dev features
export const devItems: NavItem[] = [
  { title: 'Dev Tools', icon: Terminal, href: '/admin' },
];
