'use client';

import { SidebarInset, SidebarProvider } from '@saint-giong/bamboo-ui';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { RealtimeInitializer } from '@/components/realtime/realtime-initializer';
import { useAuthStore } from '@/stores';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isActivated = useAuthStore((state) => state.isActivated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    // Only redirect after hydration is complete
    if (!hasHydrated) return;

    // Redirect unauthenticated users to login
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (!isActivated) {
      // User is logged in but not activated - redirect to verify
      router.replace('/verify');
    }
  }, [isAuthenticated, isActivated, hasHydrated, router]);

  // Don't render dashboard until hydration is complete and user is authenticated and activated
  if (!hasHydrated || !isAuthenticated || !isActivated) {
    return null;
  }

  return (
    <SidebarProvider>
      <RealtimeInitializer /> {/* init socket connection */}
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      <SidebarInset>
        {/* Main content with bottom padding for mobile nav */}
        <div className="relative flex h-screen w-full flex-col overflow-y-auto overflow-x-hidden pb-16 md:pb-0">
          {children}
        </div>
      </SidebarInset>
      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </SidebarProvider>
  );
}
