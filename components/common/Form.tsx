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

// Input styling constants
const inputBaseStyles =
  'w-full border-0 border-b-2 border-muted-foreground/30 bg-transparent py-2 text-foreground transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-0';

// Styled Form Input
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  rightElement?: ReactNode;
  error?: string;
}

export function FormInput({
  label,
  required,
  rightElement,
  error,
  type = 'text',
  name,
  className = '',
  ...props
}: FormInputProps) {
  const isPassword = type === 'password';

  // Map of field names to autoComplete values
  const autoCompleteMap: Record<string, string> = {
    email: 'email',
    password: 'current-password',
    newPassword: 'new-password',
    confirmPassword: 'new-password',
    companyName: 'organization',
    phoneNumber: 'tel',
    city: 'address-level2',
    address: 'street-address',
    country: 'country-name',
  };

  // Derive autoComplete from name if not provided
  const autoComplete =
    props.autoComplete ?? (name ? autoCompleteMap[name] : undefined);

  if (isPassword) {
    return (
      <PasswordField className="space-y-2">
        <Label className="block font-medium text-foreground text-sm">
          {label}
          {required && <span className="text-foreground"> *</span>}
        </Label>
        <div className="relative">
          <PasswordInput
            name={name}
            autoComplete={autoComplete}
            className={className}
            required={required}
            {...props}
          />
          <PasswordToggleButton />
        </div>
        {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
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
          name={name}
          autoComplete={autoComplete}
          required={required}
          className={cn(inputBaseStyles, className)}
          {...props}
        />
        {rightElement && (
          <div className="-translate-y-1/2 absolute top-1/2 right-0">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
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
      className={cn(
        inputBaseStyles,
        'pr-10 [&::-ms-clear]:hidden [&::-ms-reveal]:hidden',
        className
      )}
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
