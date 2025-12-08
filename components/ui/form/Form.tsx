'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { usePasswordToggle } from '../../headless/form/hooks';

// Password Field Context Custom
interface PasswordFieldContextValue {
  isVisible: boolean;
  toggle: () => void;
  inputType: 'text' | 'password';
}

const PasswordFieldContext = createContext<PasswordFieldContextValue | null>(
  null
);

export const usePasswordFieldContext = () => {
  const context = useContext(PasswordFieldContext);
  if (!context) {
    throw new Error(
      'usePasswordFieldContext must be used within PasswordField'
    );
  }
  return context;
};

// Password Field with toggle state
export interface PasswordFieldProps {
  children: ReactNode;
  className?: string;
}

export function PasswordField({ children, className }: PasswordFieldProps) {
  const { isVisible, toggle, inputType } = usePasswordToggle();

  return (
    <PasswordFieldContext.Provider value={{ isVisible, toggle, inputType }}>
      <div className={className}>{children}</div>
    </PasswordFieldContext.Provider>
  );
}

// Password Toggle Hook
export { usePasswordToggle };
