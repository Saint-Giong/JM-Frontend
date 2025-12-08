'use client';

import { useAuthStore } from '@/stores';
import {
  Avatar,
  AvatarFallback,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
  useSidebar,
  useTheme,
} from '@saint-giong/bamboo-ui';
import { cn } from '@saint-giong/bamboo-ui/utils';
import {
  Bell,
  Briefcase,
  CreditCard,
  Home,
  LogOut,
  Monitor,
  Moon,
  PanelLeftClose,
  Search,
  Settings,
  Sparkles,
  Sun,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getDisplayName(user: { email: string; companyName?: string }): string {
  if (user.companyName) return user.companyName;
  // Use email username as fallback
  return user.email.split('@')[0];
}

const mainNavItems = [
  { title: 'Dashboard', icon: Home, href: '/dashboard', disabled: true },
  // { title: 'Inbox', icon: Send, href: '/inbox' },
  {
    title: 'Notifications',
    icon: Bell,
    href: '/notifications',
    badge: 2,
    disabled: true,
  },
];

const recruitmentItems = [
  { title: 'Jobs', icon: Briefcase, href: '/jobs' },
  { title: 'Applicant Search', icon: Search, href: '/applicant-search' },
  {
    title: 'Premium feature',
    icon: Sparkles,
    href: '/premium',
    disabled: true,
  },
];

const systemItems = [
  {
    title: 'Subscription',
    icon: CreditCard,
    href: '/subscription',
    disabled: true,
  },
  { title: 'Settings', icon: Settings, href: '/settings' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { open, toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const displayName = user ? getDisplayName(user) : 'Guest';
  const userEmail = user?.email ?? 'Not signed in';
  const initials = user ? getInitials(displayName) : 'G';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const ThemeIcon = !mounted
    ? Monitor
    : theme === 'light'
      ? Sun
      : theme === 'dark'
        ? Moon
        : Monitor;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex h-14 items-center gap-2">
            {open && (
              <SidebarMenuButton size="lg" asChild tooltip="DEVision">
                <Link href="/">
                  <Image
                    src="/DEVision-light.png"
                    alt="DEVision Logo"
                    className="h-6 dark:hidden"
                    width={120}
                    height={24}
                  />
                  <Image
                    src="/DEVision-dark.png"
                    alt="DEVision Logo"
                    className="hidden h-6 dark:block"
                    width={120}
                    height={24}
                  />
                </Link>
              </SidebarMenuButton>
            )}
            <SidebarMenuButton
              onClick={toggleSidebar}
              tooltip="Collapse sidebar"
              className="ml-auto size-8"
            >
              <PanelLeftClose
                className={cn(
                  'h-4 w-4 transition-all duration-300',
                  open ? 'rotate-0' : 'rotate-180'
                )}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild={!item.disabled}
                    isActive={pathname === item.href}
                    tooltip={
                      item.disabled ? `${item.title} (Coming soon)` : item.title
                    }
                    disabled={item.disabled}
                    className={
                      item.disabled ? 'cursor-not-allowed opacity-50' : ''
                    }
                  >
                    {item.disabled ? (
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
                    ) : (
                      <Link href={item.href}>
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
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Recruitment</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recruitmentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild={!item.disabled}
                    isActive={pathname === item.href}
                    tooltip={
                      item.disabled ? `${item.title} (Coming soon)` : item.title
                    }
                    disabled={item.disabled}
                    className={
                      item.disabled ? 'cursor-not-allowed opacity-50' : ''
                    }
                  >
                    {item.disabled ? (
                      <>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </>
                    ) : (
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild={!item.disabled}
                    isActive={pathname === item.href}
                    tooltip={
                      item.disabled ? `${item.title} (Coming soon)` : item.title
                    }
                    disabled={item.disabled}
                    className={
                      item.disabled ? 'cursor-not-allowed opacity-50' : ''
                    }
                  >
                    {item.disabled ? (
                      <>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </>
                    ) : (
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {/* Theme Toggle */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={cycleTheme}
              tooltip={`Theme: ${mounted ? theme : 'system'}`}
            >
              <ThemeIcon className="h-4 w-4" />
              <span className="capitalize">
                {mounted ? theme : 'system'} mode
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* User Menu */}
          <SidebarMenuItem>
            {mounted ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    tooltip={displayName}
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {displayName}
                      </span>
                      <span className="truncate text-muted-foreground text-xs">
                        {userEmail}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                  side="top"
                  align="start"
                  sideOffset={4}
                >
                  <DropdownMenuItem onClick={() => router.push('/settings')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SidebarMenuButton size="lg" tooltip={displayName}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{displayName}</span>
                  <span className="truncate text-muted-foreground text-xs">
                    {userEmail}
                  </span>
                </div>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
