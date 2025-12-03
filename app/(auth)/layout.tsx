'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import DevisionLogo from '@/public/DEVision.png';
import { Button } from '@saint-giong/bamboo-ui';
import { TermsPrivacy } from './_components/TermsPrivacy';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLogin = pathname === '/login';
    const isSignup = pathname === '/signup';

    return (
        <div className="flex h-screen overflow-hidden p-5">
            {/* image section */}
            <div className="hidden lg:flex lg:w-1/2 bg-muted items-center justify-center rounded-2xl">
                Placeholder
            </div>

            {/* form section */}
            <div className="flex flex-1 flex-col lg:px-10 pt-5 overflow-y-auto">
                {/* header */}
                <div className="flex items-center justify-between gap-20">
                    <Image src={DevisionLogo} alt="DEVision Logo" />
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                        </span>
                        <a href={isLogin ? "/signup" : "/login"}>
                            <Button variant="outline" className="border-black">
                                {isLogin ? "Sign up" : "Log in"}
                            </Button>
                        </a>
                    </div>
                </div>

                {/* form */}
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md">
                        {children}
                    </div>
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
