'use client';

import { useState, useCallback, useMemo } from 'react';
import { z } from 'zod';
import type { EmploymentType } from '@/components/applicant/types';
import type { JobFormData, JobSalary } from '../types';

// Zod schemas
const jobSalaryRangeSchema = z
  .object({
    type: z.literal('range'),
    min: z.number().min(0, 'Minimum salary must be positive'),
    max: z.number().min(0, 'Maximum salary must be positive'),
    currency: z.string().min(1, 'Currency is required'),
  })
  .refine((data) => data.max >= data.min, {
    message: 'Maximum salary must be greater than or equal to minimum',
  });

const jobSalaryEstimationSchema = z.object({
  type: z.literal('estimation'),
  estimationType: z.enum(['about', 'up-to', 'from']),
  amount: z.number().min(0, 'Amount must be positive'),
  currency: z.string().min(1, 'Currency is required'),
});

const jobSalaryNegotiableSchema = z.object({
  type: z.literal('negotiable'),
});

const jobSalarySchema = z.discriminatedUnion('type', [
  jobSalaryRangeSchema,
  jobSalaryEstimationSchema,
  jobSalaryNegotiableSchema,
]);

const employmentTypesSchema = z
  .array(z.enum(['full-time', 'part-time', 'internship', 'contract']))
  .min(1, 'At least one employment type is required')
  .refine(
    (types) => !(types.includes('full-time') && types.includes('part-time')),
    { message: 'Cannot select both Full-time and Part-time' }
  );

const jobFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().min(1, 'Description is required'),
  employmentTypes: employmentTypesSchema,
  salary: jobSalarySchema,
  location: z.string().min(1, 'Location is required'),
  skills: z.array(z.string()),
  expiryDate: z.string().optional(),
});

export type JobFormErrors = Partial<
  Record<keyof JobFormData | 'salary', string>
>;

const defaultSalary: JobSalary = {
  type: 'range',
  min: 0,
  max: 0,
  currency: 'USD',
};

const defaultFormData: JobFormData = {
  title: '',
  description: '',
  employmentTypes: ['full-time'],
  salary: defaultSalary,
  location: '',
  skills: [],
  expiryDate: undefined,
};

export interface UseJobFormOptions {
  initialData?: Partial<JobFormData>;
  onSubmit?: (data: JobFormData) => void | Promise<void>;
}

export interface UseJobFormReturn {
  formData: JobFormData;
  errors: JobFormErrors;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  setField: <K extends keyof JobFormData>(
    field: K,
    value: JobFormData[K]
  ) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setEmploymentTypes: (types: EmploymentType[]) => void;
  setSalary: (salary: JobSalary) => void;
  setLocation: (location: string) => void;
  setSkills: (skills: string[]) => void;
  setExpiryDate: (date: string | undefined) => void;
  validate: () => boolean;
  handleSubmit: () => Promise<void>;
  reset: () => void;
}

export function useJobForm(options: UseJobFormOptions = {}): UseJobFormReturn {
  const { initialData, onSubmit } = options;

  const initialFormData = useMemo(
    () => ({
      ...defaultFormData,
      ...initialData,
    }),
    [initialData]
  );

  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [errors, setErrors] = useState<JobFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const setField = useCallback(
    <K extends keyof JobFormData>(field: K, value: JobFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setIsDirty(true);
      // Clear error for this field when it changes
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const setTitle = useCallback(
    (title: string) => setField('title', title),
    [setField]
  );

  const setDescription = useCallback(
    (description: string) => setField('description', description),
    [setField]
  );

  const setEmploymentTypes = useCallback(
    (types: EmploymentType[]) => setField('employmentTypes', types),
    [setField]
  );

  const setSalary = useCallback(
    (salary: JobSalary) => setField('salary', salary),
    [setField]
  );

  const setLocation = useCallback(
    (location: string) => setField('location', location),
    [setField]
  );

  const setSkills = useCallback(
    (skills: string[]) => setField('skills', skills),
    [setField]
  );

  const setExpiryDate = useCallback(
    (date: string | undefined) => setField('expiryDate', date),
    [setField]
  );

  const validate = useCallback(() => {
    const result = jobFormSchema.safeParse(formData);

    if (result.success) {
      setErrors({});
      return true;
    }

    const newErrors: JobFormErrors = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path[0] as keyof JobFormData;
      if (!newErrors[path]) {
        newErrors[path] = issue.message;
      }
    });

    setErrors(newErrors);
    return false;
  }, [formData]);

  const isValid = useMemo(() => {
    const result = jobFormSchema.safeParse(formData);
    return result.success;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit, validate]);

  const reset = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setIsDirty(false);
  }, [initialFormData]);

  return {
    formData,
    errors,
    isSubmitting,
    isDirty,
    isValid,
    setField,
    setTitle,
    setDescription,
    setEmploymentTypes,
    setSalary,
    setLocation,
    setSkills,
    setExpiryDate,
    validate,
    handleSubmit,
    reset,
  };
}
