'use client';

import { FormInput } from '@/components/common/Form';
import { Check, X } from 'lucide-react';

interface PasswordRequirement {
  label: string;
  met: boolean;
}

interface AccountStepProps {
  email: string;
  password: string;
  emailError?: string;
  passwordRequirements: PasswordRequirement[];
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailBlur: () => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordBlur: () => void;
}

export function AccountStep({
  email,
  password,
  emailError,
  passwordRequirements,
  onEmailChange,
  onEmailBlur,
  onPasswordChange,
  onPasswordBlur,
}: AccountStepProps) {
  return (
    <>
      {/* Email */}
      <FormInput
        label="Email"
        name="email"
        type="email"
        placeholder="example@email.com"
        required
        value={email}
        onChange={onEmailChange}
        onBlur={onEmailBlur}
        error={emailError}
      />

      {/* Password with requirements */}
      <div className="flex gap-6">
        <div className="flex-1">
          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="Create a strong password"
            required
            value={password}
            onChange={onPasswordChange}
            onBlur={onPasswordBlur}
          />
        </div>
        <div className="w-52 text-xs">
          <p className="mb-1 font-medium text-muted-foreground">
            Password requirements:
          </p>
          <ul className="space-y-0.5">
            {passwordRequirements.map((req, i) => (
              <li key={i} className="flex items-center gap-1">
                {req.met ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <X className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={
                    req.met ? 'text-green-600' : 'text-muted-foreground'
                  }
                >
                  {req.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
