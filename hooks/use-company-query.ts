'use client';

import {
  type Company,
  type CompanyData,
  type CompanyDeleteResponse,
  type CompanyUpdate,
  companyApi,
} from '@/lib/api';
import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

// Query keys
export const companyKeys = {
  all: ['companies'] as const,
  detail: (id: string) => [...companyKeys.all, id] as const,
};

/**
 * React Query hook for fetching a company by ID
 */
export function useCompanyQuery(
  id: string | undefined,
  options?: Omit<
    UseQueryOptions<Company, Error>,
    'queryKey' | 'queryFn' | 'enabled'
  >
) {
  return useQuery({
    queryKey: companyKeys.detail(id ?? ''),
    queryFn: () => companyApi.get(id!),
    enabled: !!id,
    ...options,
  });
}

/**
 * React Query mutation for creating a company
 */
export function useCreateCompanyMutation(
  options?: Omit<UseMutationOptions<Company, Error, CompanyData>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companyApi.create,
    onSuccess: (data) => {
      queryClient.setQueryData(companyKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
    ...options,
  });
}

/**
 * React Query mutation for updating a company
 */
export function useUpdateCompanyMutation(
  options?: Omit<
    UseMutationOptions<Company, Error, { id: string; data: CompanyUpdate }>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => companyApi.update(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(companyKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
    ...options,
  });
}

/**
 * React Query mutation for deleting a company
 */
export function useDeleteCompanyMutation(
  options?: Omit<
    UseMutationOptions<CompanyDeleteResponse, Error, string>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companyApi.delete,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: companyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
    ...options,
  });
}
