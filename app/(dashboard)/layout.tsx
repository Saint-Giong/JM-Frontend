'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { SidebarInset, SidebarProvider } from '@saint-giong/bamboo-ui';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      <SidebarInset>
        {/* Main content with bottom padding for mobile nav */}
        <div className="pb-16 md:pb-0">{children}</div>
      </SidebarInset>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </SidebarProvider>
  );
}
