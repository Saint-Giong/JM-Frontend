'use client';

import {
  type Company,
  type CompanyData,
  type CompanyUpdate,
  companyApi,
} from '@/lib/api';
import { HttpError } from '@/lib/http';
import { useCallback, useState } from 'react';

// Field-level error mapping
export type FieldErrors = Record<string, string>;

interface UseCompanyState {
  company: Company | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  fieldErrors: FieldErrors;
}

interface UseCompanyReturn extends UseCompanyState {
  // CRUD operations
  fetchCompany: (id: string) => Promise<Company | null>;
  createCompany: (data: CompanyData) => Promise<Company | null>;
  updateCompany: (id: string, data: CompanyUpdate) => Promise<Company | null>;
  deleteCompany: (id: string) => Promise<boolean>;

  // State management
  setCompany: (company: Company | null) => void;
  clearError: () => void;
  clearFieldError: (field: string) => void;
  reset: () => void;
}

const initialState: UseCompanyState = {
  company: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  fieldErrors: {},
};

/**
 * Hook for company CRUD operations
 *
 * Provides a complete interface for managing company profiles with
 * loading states, error handling, and automatic state management.
 *
 * @example
 * ```tsx
 * const {
 *   company,
 *   isLoading,
 *   fetchCompany,
 *   updateCompany,
 *   error
 * } = useCompany();
 *
 * useEffect(() => {
 *   fetchCompany(companyId);
 * }, [companyId]);
 *
 * const handleSave = async (data) => {
 *   await updateCompany(companyId, data);
 * };
 * ```
 */
export function useCompany(initialCompany?: Company | null): UseCompanyReturn {
  const [state, setState] = useState<UseCompanyState>({
    ...initialState,
    company: initialCompany ?? null,
  });

  const setCompany = useCallback((company: Company | null) => {
    setState((prev) => ({ ...prev, company }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, fieldErrors: {} }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setState((prev) => {
      const newFieldErrors = { ...prev.fieldErrors };
      delete newFieldErrors[field];
      return { ...prev, fieldErrors: newFieldErrors };
    });
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const handleError = useCallback(
    (err: unknown): { message: string; fieldErrors: FieldErrors } => {
      if (err instanceof HttpError) {
        const data = err.data as Record<string, unknown> | undefined;
        const fieldErrors: FieldErrors = {};

        // Check for validation errors with details
        if (data?.details && Array.isArray(data.details)) {
          const details = data.details as Array<{
            field?: string;
            issue?: string;
            value?: unknown;
          }>;

          // Extract field-level errors
          for (const d of details) {
            if (d.field && d.issue) {
              fieldErrors[d.field.toLowerCase()] = d.issue;
            }
          }

          if (Object.keys(fieldErrors).length > 0) {
            return {
              message:
                (data?.message as string) || 'Please fix the errors below',
              fieldErrors,
            };
          }
        }

        return {
          message:
            (data?.message as string) ?? err.statusText ?? 'An error occurred',
          fieldErrors: {},
        };
      }
      if (err instanceof Error) {
        return { message: err.message, fieldErrors: {} };
      }
      return { message: 'An unexpected error occurred', fieldErrors: {} };
    },
    []
  );

  const fetchCompany = useCallback(
    async (id: string): Promise<Company | null> => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        fieldErrors: {},
      }));

      try {
        const company = await companyApi.get(id);
        setState((prev) => ({ ...prev, company, isLoading: false }));
        return company;
      } catch (err) {
        const { message, fieldErrors } = handleError(err);
        setState((prev) => ({
          ...prev,
          company: null, // Clear cached company on error (e.g., 404 after deletion)
          error: message,
          fieldErrors,
          isLoading: false,
        }));
        return null;
      }
    },
    [handleError]
  );

  const createCompany = useCallback(
    async (data: CompanyData): Promise<Company | null> => {
      setState((prev) => ({
        ...prev,
        isCreating: true,
        error: null,
        fieldErrors: {},
      }));

      try {
        const company = await companyApi.create(data);
        setState((prev) => ({ ...prev, company, isCreating: false }));
        return company;
      } catch (err) {
        const { message, fieldErrors } = handleError(err);
        setState((prev) => ({
          ...prev,
          error: message,
          fieldErrors,
          isCreating: false,
        }));
        return null;
      }
    },
    [handleError]
  );

  const updateCompany = useCallback(
    async (id: string, data: CompanyUpdate): Promise<Company | null> => {
      setState((prev) => ({
        ...prev,
        isUpdating: true,
        error: null,
        fieldErrors: {},
      }));

      try {
        const company = await companyApi.update(id, data);
        setState((prev) => ({ ...prev, company, isUpdating: false }));
        return company;
      } catch (err) {
        const { message, fieldErrors } = handleError(err);
        setState((prev) => ({
          ...prev,
          error: message,
          fieldErrors,
          isUpdating: false,
        }));
        return null;
      }
    },
    [handleError]
  );

  const deleteCompany = useCallback(
    async (id: string): Promise<boolean> => {
      setState((prev) => ({
        ...prev,
        isDeleting: true,
        error: null,
        fieldErrors: {},
      }));

      try {
        await companyApi.delete(id);
        setState((prev) => ({ ...prev, company: null, isDeleting: false }));
        return true;
      } catch (err) {
        const { message, fieldErrors } = handleError(err);
        setState((prev) => ({
          ...prev,
          error: message,
          fieldErrors,
          isDeleting: false,
        }));
        return false;
      }
    },
    [handleError]
  );

  return {
    ...state,
    fetchCompany,
    createCompany,
    updateCompany,
    deleteCompany,
    setCompany,
    clearError,
    clearFieldError,
    reset,
  };
}
