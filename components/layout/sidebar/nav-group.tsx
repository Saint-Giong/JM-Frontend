'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@saint-giong/bamboo-ui';
import type { NavItem } from './nav-config';
import { NavMenuItem } from './nav-menu-item';

interface NavGroupProps {
  label?: string;
  items: NavItem[];
  pathname: string;
}

export function NavGroup({ label, items, pathname }: NavGroupProps) {
  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <NavMenuItem
              key={item.title}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
