'use client';

import Image from 'next/image';
import { type ReactNode } from 'react';
import { Button } from '@/components/headless/button';
import GoogleIcon from '@/assets/google.svg';

interface SSOButtonProps {
  icon: ReactNode;
  children: ReactNode;
  onAuth: () => unknown | Promise<unknown>;
}

export function SSOButton({ icon, children, onAuth }: SSOButtonProps) {
  const buttonStyle = { width: '17.5rem', height: '2.625rem' };

  return (
    <Button
      type="button"
      variant="outline"
      className="border-foreground text-foreground hover:bg-muted rounded-sm"
      style={buttonStyle}
      onClick={onAuth}
    >
      {icon}
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
  return (
    <SSOButton
      icon={
        <Image
          src={GoogleIcon}
          alt="Google"
          width={20}
          height={20}
          className="mr-2"
        />
      }
      onAuth={onAuth}
    >
      {children}
    </SSOButton>
  );
}

export default SSOButton;
