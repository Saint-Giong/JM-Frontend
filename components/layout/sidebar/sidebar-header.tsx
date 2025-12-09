'use client';

import {
  SidebarHeader as BaseSidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@saint-giong/bamboo-ui';
import { cn } from '@saint-giong/bamboo-ui/utils';
import { PanelLeftClose } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SidebarHeaderProps {
  open: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ open, onToggle }: SidebarHeaderProps) {
  return (
    <BaseSidebarHeader>
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
            onClick={onToggle}
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
    </BaseSidebarHeader>
  );
}
