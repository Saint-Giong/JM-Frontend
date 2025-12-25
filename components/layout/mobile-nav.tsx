'use client';

import { useNotificationStore } from '@/stores';
import { NotificationBadge } from '@/components/ui/notification-badge';
import { cn } from '@saint-giong/bamboo-ui';
import { Bell, Briefcase, Home, Search, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { title: 'Home', icon: Home, href: '/dashboard' },
  { title: 'Jobs', icon: Briefcase, href: '/jobs' },
  { title: 'Search', icon: Search, href: '/applicant-search' },
  { title: 'Notifications', icon: Bell, href: '/notifications' },
  { title: 'Profile', icon: User, href: '/profile' },
];

export function MobileNav() {
  const pathname = usePathname();
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          const isNotificationItem = item.href === '/notifications';

          return (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors relative',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {isNotificationItem && (
                  <NotificationBadge count={unreadCount} variant="mobile" />
                )}
              </div>
              <span className="text-[10px]">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
