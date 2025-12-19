'use client';

import { useAuthStore } from '@/stores';
import { Button } from '@saint-giong/bamboo-ui';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { TermsPrivacy } from './_components/TermsPrivacy';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isActivated = useAuthStore((state) => state.isActivated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isLogin = pathname === '/login';
  const isSignup = pathname === '/signup';

  useEffect(() => {
    // Redirect authenticated and activated users to dashboard
    if (hasHydrated && isAuthenticated && isActivated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isActivated, hasHydrated, router]);

  // Show nothing while hydrating or if user is already authenticated and activated
  if (!hasHydrated || (isAuthenticated && isActivated)) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden p-5">
      {/* image section */}
      <div className="hidden items-center justify-center rounded-2xl bg-muted lg:flex lg:w-1/2">
        Placeholder
      </div>

      {/* form section */}
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 lg:px-10">
        {/* header */}
        <div className="flex items-center justify-between gap-20">
          <Image
            src="/DEVision-dark.png"
            alt="DEVision Logo"
            width={135}
            height={25}
            className="hidden dark:block"
          />
          <Image
            src="/DEVision-light.png"
            alt="DEVision Logo"
            width={135}
            height={25}
            className="block dark:hidden"
          />
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <a href={isLogin ? '/signup' : '/login'}>
              <Button variant="outline" className="border-black">
                {isLogin ? 'Sign up' : 'Log in'}
              </Button>
            </a>
          </div>
        </div>

        {/* form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>

        {/* footer */}
        {isSignup && (
          <div className="pb-5">
            <TermsPrivacy />
          </div>
        )}
      </div>
    </div>
  );
}
