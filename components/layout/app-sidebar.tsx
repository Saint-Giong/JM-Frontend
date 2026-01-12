'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from '@saint-giong/bamboo-ui';
import { usePathname } from 'next/navigation';
import {
  accountItems,
  devItems,
  hiringItems,
  mainNavItems,
  NavGroup,
  resourceItems,
  SidebarHeader,
  ThemeToggle,
  UserDropdown,
  useSidebarState,
} from './sidebar';

export function AppSidebar() {
  const pathname = usePathname();
  const {
    open,
    toggleSidebar,
    theme,
    cycleTheme,
    mounted,
    displayName,
    userEmail,
    initials,
    handleLogout,
    router,
    unreadCount,
  } = useSidebarState();

  // Update notification badge dynamically
  const dynamicMainNavItems = mainNavItems.map((item) =>
    item.href === '/notifications'
      ? { ...item, badge: unreadCount > 0 ? unreadCount : undefined }
      : item
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader open={open} onToggle={toggleSidebar} />

      <SidebarContent>
        <NavGroup items={dynamicMainNavItems} pathname={pathname} />
        <NavGroup label="Hiring" items={hiringItems} pathname={pathname} />
        <NavGroup label="Account" items={accountItems} pathname={pathname} />
        <NavGroup label="Resources" items={resourceItems} pathname={pathname} />
        <NavGroup label="Developer" items={devItems} pathname={pathname} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ThemeToggle
              theme={theme}
              mounted={mounted}
              onCycleTheme={cycleTheme}
            />
          </SidebarMenuItem>

          <SidebarMenuItem>
            <UserDropdown
              displayName={displayName}
              userEmail={userEmail}
              initials={initials}
              mounted={mounted}
              router={router}
              onLogout={handleLogout}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
