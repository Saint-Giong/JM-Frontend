'use client';

import { Button as BambooButton } from '@saint-giong/bamboo-ui';
import { type ComponentProps, forwardRef } from 'react';

// Button Types
export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends ComponentProps<typeof BambooButton> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
}

// Button Component
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, isLoading, loadingText, disabled, ...props }, ref) => {
    return (
      <BambooButton ref={ref} disabled={disabled || isLoading} {...props}>
        {isLoading ? loadingText || 'Loading...' : children}
      </BambooButton>
    );
  }
);
Button.displayName = 'Button';

export default Button;
