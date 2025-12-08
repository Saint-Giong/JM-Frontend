'use client';

import {
  PasswordField,
  usePasswordFieldContext,
} from '@/components/headless/form';
import { Button, cn, Label } from '@saint-giong/bamboo-ui';
import { Eye, EyeOff } from 'lucide-react';
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from 'react';

// Styled Form Input
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  rightElement?: ReactNode;
}

export function FormInput({
  label,
  required,
  rightElement,
  type = 'text',
  className = '',
  ...props
}: FormInputProps) {
  const isPassword = type === 'password';

  if (isPassword) {
    return (
      <PasswordField className="space-y-2">
        <Label className="block font-medium text-foreground text-sm">
          {label}
          {required && <span className="text-foreground"> *</span>}
        </Label>
        <div className="relative">
          <PasswordInput className={className} required={required} {...props} />
          <PasswordToggleButton />
        </div>
      </PasswordField>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="block font-medium text-foreground text-sm">
        {label}
        {required && <span className="text-foreground"> *</span>}
      </Label>
      <div className="relative">
        <input
          type={type}
          required={required}
          className={`w-full border-0 border-muted-foreground/30 border-b bg-transparent py-2 text-foreground transition-colors placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="-translate-y-1/2 absolute top-1/2 right-0">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

// password input that uses context
function PasswordInput({
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const { inputType } = usePasswordFieldContext();

  return (
    <input
      type={inputType}
      className={`w-full border-0 border-muted-foreground/30 border-b bg-transparent py-2 pr-10 text-foreground transition-colors placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none [&::-ms-clear]:hidden [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden ${className}`}
      {...props}
    />
  );
}

// password toggle button
function PasswordToggleButton() {
  const { isVisible, toggle } = usePasswordFieldContext();

  return (
    <button
      type="button"
      onClick={toggle}
      className="-translate-y-1/2 absolute top-1/2 right-0 text-muted-foreground transition-colors hover:text-foreground"
      tabIndex={-1}
    >
      {isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
  );
}

// Form Header
interface FormHeaderProps {
  title: string;
  subtitle?: string;
}

export function FormHeader({ title, subtitle }: FormHeaderProps) {
  return (
    <div className="space-y-2">
      <h1
        className="font-normal text-3xl"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {title}
      </h1>
      {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
    </div>
  );
}

// Form Submit Button
interface FormSubmitButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isSubmitting?: boolean;
}

export function FormSubmitButton({
  children,
  isSubmitting = false,
  className = '',
  ...props
}: FormSubmitButtonProps) {
  return (
    <Button
      type="submit"
      className={cn(
        'h-[2.625rem] w-[17.5rem] rounded-sm bg-foreground text-background hover:bg-foreground/90',
        className
      )}
      disabled={isSubmitting}
      {...props}
    >
      {isSubmitting ? 'Loading...' : children}
    </Button>
  );
}

// Form Actions Container
interface FormActionsProps {
  children: ReactNode;
  className?: string;
}

export function FormActions({ children, className = '' }: FormActionsProps) {
  return (
    <div className={`flex flex-col items-center space-y-3 pt-4 ${className}`}>
      {children}
    </div>
  );
}

// Form Link
interface FormLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function FormLink({ href, children, className = '' }: FormLinkProps) {
  return (
    <a
      href={href}
      className={`text-muted-foreground text-xs transition-colors hover:text-foreground ${className}`}
    >
      {children}
    </a>
  );
}

// Form Container
interface FormProps {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export function Form({ children, onSubmit, className = '' }: FormProps) {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      {children}
    </form>
  );
}

export default Form;
