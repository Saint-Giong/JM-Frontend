'use client';

import {
  Badge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@saint-giong/bamboo-ui';
import Link from 'next/link';
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
      <item.icon className="h-4 w-4" />
      <span>{item.title}</span>
      {item.badge && (
        <Badge
          variant="destructive"
          className="ml-auto flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
        >
          {item.badge}
        </Badge>
      )}
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
