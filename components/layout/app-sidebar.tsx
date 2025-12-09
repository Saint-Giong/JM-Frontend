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
  mainNavItems,
  NavGroup,
  recruitmentItems,
  SidebarHeader,
  systemItems,
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
  } = useSidebarState();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader open={open} onToggle={toggleSidebar} />

      <SidebarContent>
        <NavGroup items={mainNavItems} pathname={pathname} />
        <NavGroup
          label="Recruitment"
          items={recruitmentItems}
          pathname={pathname}
        />
        <NavGroup label="System" items={systemItems} pathname={pathname} />
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
