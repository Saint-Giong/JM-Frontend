import { z } from 'zod';
import { countries } from '@/mocks/countries';

const validDialCodes = countries.map((c) => c.dialCode);

// Base schema fields shared between regular and Google signup
const baseSignupFields = {
  companyName: z.string().min(1, 'Company name is required'),
  email: z.email('Invalid email address'),
  country: z.string().min(1, 'Country is required'),
  dialCode: z
    .string()
    .optional()
    .refine(
      (val) => !val || validDialCodes.includes(val),
      'Invalid international dial code'
    ),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+$/.test(val),
      'Phone number must contain only digits'
    )
    .refine(
      (val) => !val || val.length < 13,
      'Phone number must be less than 13 digits'
    ),
  city: z.string().optional(),
  address: z.string().optional(),
};

// Regular signup schema (requires password)
export const signupSchema = z.object({
  ...baseSignupFields,
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[0-9]/, 'At least 1 number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'At least 1 special character')
    .regex(/[A-Z]/, 'At least 1 capitalized letter'),
});

// Google signup schema
export const googleSignupSchema = z.object({
  ...baseSignupFields,
  password: z.string().optional(), // Password not required for Google signup
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type GoogleSignupFormData = z.infer<typeof googleSignupSchema>;

// Password requirements for UI display
export const passwordRequirements = [
  { regex: /.{8,}/, label: 'At least 8 characters' },
  { regex: /[0-9]/, label: 'At least 1 number' },
  {
    regex: /[!@#$%^&*(),.?":{}|<>]/,
    label: 'At least 1 special character (e.g., $#@!)',
  },
  { regex: /[A-Z]/, label: 'At least 1 capitalized letter' },
];
