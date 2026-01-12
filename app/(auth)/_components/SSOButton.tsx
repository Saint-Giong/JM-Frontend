'use client';

import Image from 'next/image';
import { type ReactNode, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/headless/button';

interface SSOButtonProps {
  icon: ReactNode;
  loadingIcon?: ReactNode;
  children: ReactNode;
  onAuth: () => unknown | Promise<unknown>;
  isLoading?: boolean;
}

export function SSOButton({
  icon,
  loadingIcon,
  children,
  onAuth,
  isLoading = false,
}: SSOButtonProps) {
  const buttonStyle = { width: '17.5rem', height: '2.625rem' };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full rounded-sm border-foreground text-foreground hover:bg-muted"
      style={buttonStyle}
      onClick={onAuth}
      disabled={isLoading}
    >
      {isLoading
        ? (loadingIcon ?? <Loader2 className="mr-2 h-5 w-5 animate-spin" />)
        : icon}
      {children}
    </Button>
  );
}

// google sso button
interface GoogleSSOButtonProps {
  children?: ReactNode;
  onAuth: () => unknown | Promise<unknown>;
}

export function GoogleSSOButton({
  children = 'Continue with Google',
  onAuth,
}: GoogleSSOButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      await onAuth();
    } finally {
      // Note: setIsLoading(false) may not run if redirected to Google OAuth
      setIsLoading(false);
    }
  };

  return (
    <SSOButton
      icon={
        <Image
          src="/google.png"
          alt="Google"
          width={20}
          height={20}
          className="mr-2"
        />
      }
      onAuth={handleAuth}
      isLoading={isLoading}
    >
      {children}
    </SSOButton>
  );
}

export default SSOButton;
