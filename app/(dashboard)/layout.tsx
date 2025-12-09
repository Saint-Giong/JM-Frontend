'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useAuthStore } from '@/stores';
import { SidebarInset, SidebarProvider } from '@saint-giong/bamboo-ui';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    // Only redirect after hydration is complete
    if (hasHydrated && !user) {
      router.replace('/login');
    }
  }, [user, hasHydrated, router]);

  // Don't render dashboard until hydration is complete and user is confirmed
  if (!hasHydrated || !user) {
    return null;
  }

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
