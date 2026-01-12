'use client';

import { cn } from '@saint-giong/bamboo-ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { AdminNavItem } from './types';

const adminNavItems: AdminNavItem[] = [
  { title: 'Overview', href: '/admin', description: 'Dashboard & quick stats' },
  {
    title: 'Companies',
    href: '/admin/companies',
    description: 'Browse all companies',
  },
  {
    title: 'Subscriptions',
    href: '/admin/subscriptions',
    description: 'Subscription status',
  },
  {
    title: 'Payments',
    href: '/admin/payments',
    description: 'Payment transactions',
  },
  { title: 'Jobs', href: '/admin/jobs', description: 'All job posts' },
  {
    title: 'Skill Tags',
    href: '/admin/skill-tags',
    description: 'Tag management',
  },
  {
    title: 'Discovery',
    href: '/admin/discovery',
    description: 'Applicant search index',
  },
  {
    title: 'Notifications',
    href: '/admin/notifications',
    description: 'Test notifications',
  },
  {
    title: 'API Tester',
    href: '/admin/api-tester',
    description: 'Test API endpoints',
  },
];

export function AdminNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex gap-1 overflow-x-auto border-b bg-muted/30 px-4 py-2">
      {adminNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex-shrink-0 rounded-md px-3 py-1.5 font-medium text-sm transition-colors',
            isActive(item.href)
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export { adminNavItems };
