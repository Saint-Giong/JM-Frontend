import { z } from 'zod';
import { countries } from '@/mocks/countries';

const validDialCodes = countries.map((c) => c.dialCode);

export const signupSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[0-9]/, 'At least 1 number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'At least 1 special character')
    .regex(/[A-Z]/, 'At least 1 capitalized letter'),
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
});

export type SignupFormData = z.infer<typeof signupSchema>;

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
