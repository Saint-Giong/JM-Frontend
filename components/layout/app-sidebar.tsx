'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@saint-giong/bamboo-ui';
import {
  Bell,
  Briefcase,
  CreditCard,
  Home,
  Search,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const mainNavItems = [
  { title: 'Dashboard', icon: Home, href: '/dashboard' },
  // { title: 'Inbox', icon: Inbox, href: '/inbox' },
  { title: 'Notifications', icon: Bell, href: '/notifications', badge: 2 },
];

const recruitmentItems = [
  { title: 'Jobs', icon: Briefcase, href: '/jobs' },
  { title: 'Applicant Search', icon: Search, href: '/applicant-search' },
  { title: 'Premium feature', icon: Sparkles, href: '/premium' },
];

const systemItems = [
  { title: 'Subscription', icon: CreditCard, href: '/subscription' },
  // { title: 'Settings', icon: Settings, href: '/settings' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          </div>
          <span className="text-xl font-semibold">DEVision</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant="destructive"
                          className="ml-auto h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Recruitment
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recruitmentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/user.jpg" alt="Saint Giong" />
            <AvatarFallback>SG</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Saint Giong</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
