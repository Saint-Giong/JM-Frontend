'use client';

import { cn } from '@saint-giong/bamboo-ui/utils';
import { Bell, Briefcase, Home, Search, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { title: 'Home', icon: Home, href: '/', disabled: true },
  { title: 'Jobs', icon: Briefcase, href: '/jobs' },
  { title: 'Search', icon: Search, href: '/applicant-search' },
  { title: 'Alerts', icon: Bell, href: '/notifications', disabled: true },
  { title: 'Profile', icon: User, href: '/profile', disabled: true },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          if (item.disabled) {
            return (
              <div
                key={item.title}
                className="flex flex-1 flex-col items-center justify-center gap-1 py-2 opacity-40"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px]">{item.title}</span>
              </div>
            );
          }

          return (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px]">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
