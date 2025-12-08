'use client';

import { useCallback, useMemo, useState } from 'react';
import type { z } from 'zod';
import {
  createFieldStore,
  createFormSubmitStore,
  createPasswordToggleStore,
} from './stores';

/**
 * Hook for managing password visibility toggle
 */
export function usePasswordToggle(initialVisible = false) {
  const useStore = createPasswordToggleStore(initialVisible);
  const { isVisible, toggle, show, hide } = useStore();

  return {
    isVisible,
    toggle,
    show,
    hide,
    inputType: isVisible ? 'text' : 'password',
  } as const;
}

/**
 * Hook for managing form submission state
 */
export function useFormSubmit() {
  const useStore = createFormSubmitStore();
  const { isSubmitting, error, setSubmitting, setError, reset } = useStore();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    onSubmit: (formData: FormData) => Promise<void> | void
  ) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    setError,
    handleSubmit,
    reset,
  } as const;
}

/**
 * Hook for managing input field state
 */
export function useField<T = string>(initialValue: T) {
  const useStore = createFieldStore(initialValue);
  const { value, touched, error, setValue, setTouched, setError, reset } =
    useStore();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value as T);
  };

  const onBlur = () => {
    setTouched(true);
  };

  return {
    value,
    setValue,
    touched,
    error,
    setError,
    onChange,
    onBlur,
    reset,
    inputProps: {
      value: value as string,
      onChange,
      onBlur,
    },
  } as const;
}

/**
 * Hook for wrapping an async service call with loading/error state
 */
export function useAsyncAction<TArgs extends unknown[], TResult>(
  service: (...args: TArgs) => Promise<TResult>
) {
  const useStore = createFormSubmitStore();
  const {
    isSubmitting: isLoading,
    error,
    setSubmitting,
    setError,
    reset,
  } = useStore();

  const execute = useCallback(
    async (...args: TArgs): Promise<TResult> => {
      setSubmitting(true);
      setError(null);

      try {
        const result = await service(...args);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [service, setSubmitting, setError]
  );

  return {
    execute,
    isLoading,
    error,
    reset,
  } as const;
}

/**
 * Hook for form validation with Zod schema
 */
export function useFormValidation<T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
  initialValues: z.infer<T>
) {
  type FormData = z.infer<T>;
  type FormErrors = Partial<Record<keyof FormData, string>>;

  const [values, setValues] = useState<FormData>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});

  const isValid = useMemo(() => {
    return schema.safeParse(values).success;
  }, [schema, values]);

  const setValue = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const setFieldTouched = useCallback((field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const validate = useCallback((): FormData | null => {
    const result = schema.safeParse(values);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return null;
    }

    setErrors({});
    return result.data;
  }, [schema, values]);

  const getFieldProps = useCallback(
    <K extends keyof FormData>(field: K) => ({
      value: values[field] as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setValue(field, e.target.value as FormData[K]),
      onBlur: () => setFieldTouched(field),
    }),
    [values, setValue, setFieldTouched]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isValid,
    setValue,
    setFieldTouched,
    validate,
    getFieldProps,
    reset,
  } as const;
}
