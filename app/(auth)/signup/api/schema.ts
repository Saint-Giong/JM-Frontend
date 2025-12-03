import { z } from 'zod';

export const signupSchema = z.object({
    companyName: z.string().optional(),
    email: z.email('Invalid email address'),
    password: z
        .string()
        .min(8, 'At least 8 characters')
        .regex(/[0-9]/, 'At least 1 number')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'At least 1 special character')
        .regex(/[A-Z]/, 'At least 1 capitalized letter'),
    country: z.string().min(1, 'Country is required'),
    phoneCode: z.string().optional(),
    phoneNumber: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
});

export type SignupFormData = z.infer<typeof signupSchema>;

// Password requirements for UI display
export const passwordRequirements = [
    { regex: /.{8,}/, label: 'At least 8 characters' },
    { regex: /[0-9]/, label: 'At least 1 number' },
    { regex: /[!@#$%^&*(),.?":{}|<>]/, label: 'At least 1 special character (e.g., $#@!)' },
    { regex: /[A-Z]/, label: 'At least 1 capitalized letter' },
];

