'use client';

import { SidebarMenuButton, SidebarMenuItem } from '@saint-giong/bamboo-ui';
import Link from 'next/link';
import { NotificationBadge } from '@/components/ui/notification-badge';
import type { NavItem } from './nav-config';

interface NavMenuItemProps {
  item: NavItem;
  isActive: boolean;
}

export function NavMenuItem({ item, isActive }: NavMenuItemProps) {
  const tooltip = item.disabled ? `${item.title} (Coming soon)` : item.title;
  const className = item.disabled ? 'cursor-not-allowed opacity-50' : '';

  const content = (
    <>
      <item.icon />
      <span>{item.title}</span>
      {item.badge && <NotificationBadge count={item.badge} variant="desktop" />}
    </>
  );

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild={!item.disabled}
        isActive={isActive}
        tooltip={tooltip}
        disabled={item.disabled}
        className={className}
      >
        {item.disabled ? content : <Link href={item.href}>{content}</Link>}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
