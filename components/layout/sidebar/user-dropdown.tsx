'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarMenuButton,
} from '@saint-giong/bamboo-ui';
import { LogOut, Settings, User } from 'lucide-react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface UserDropdownProps {
  displayName: string;
  userEmail: string;
  initials: string;
  logoUrl?: string;
  mounted: boolean;
  router: AppRouterInstance;
  onLogout: () => void;
}

export function UserDropdown({
  displayName,
  userEmail,
  initials,
  logoUrl,
  mounted,
  router,
  onLogout,
}: UserDropdownProps) {
  const userButton = (
    <SidebarMenuButton size="lg" tooltip={displayName}>
      <Avatar className="h-8 w-8">
        {logoUrl && <AvatarImage src={logoUrl} alt={displayName} />}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{displayName}</span>
        <span className="truncate text-muted-foreground text-xs">
          {userEmail}
        </span>
      </div>
    </SidebarMenuButton>
  );

  if (!mounted) {
    return userButton;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          tooltip={displayName}
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8">
            {logoUrl && <AvatarImage src={logoUrl} alt={displayName} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{displayName}</span>
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
        <DropdownMenuItem onClick={() => router.push('/profile')}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
