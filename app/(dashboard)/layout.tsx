'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@saint-giong/bamboo-ui';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </SidebarProvider>
  );
}
