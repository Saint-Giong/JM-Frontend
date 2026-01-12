'use client';

import {
  type ApplicantDocument,
  type ApplicantListParams,
  type ApplicantPage,
  type ApplicantSearchParams,
  type CreateSearchProfileRequest,
  type SearchProfile,
  type UpdateSearchProfileRequest,
  discoveryApi,
} from '@/lib/api/discovery';
import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

// Query keys factory
export const discoveryKeys = {
  all: ['discovery'] as const,
  // Applicants
  applicants: () => [...discoveryKeys.all, 'applicants'] as const,
  applicantList: (params?: ApplicantListParams) =>
    [...discoveryKeys.applicants(), 'list', params] as const,
  applicantSearch: (params: ApplicantSearchParams) =>
    [...discoveryKeys.applicants(), 'search', params] as const,
  applicantDetail: (id: string) =>
    [...discoveryKeys.applicants(), 'detail', id] as const,
  // Search profiles
  searchProfiles: () => [...discoveryKeys.all, 'search-profiles'] as const,
  searchProfilesByCompany: (companyId: string) =>
    [...discoveryKeys.searchProfiles(), 'company', companyId] as const,
  searchProfileDetail: (id: string) =>
    [...discoveryKeys.searchProfiles(), 'detail', id] as const,
};

// ============================================
// Applicant Query Hooks
// ============================================

/**
 * React Query hook for fetching all applicants (paginated)
 */
export function useApplicantsQuery(
  params?: ApplicantListParams,
  options?: Omit<UseQueryOptions<ApplicantPage, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: discoveryKeys.applicantList(params),
    queryFn: () => discoveryApi.getAllApplicants(params),
    ...options,
  });
}

/**
 * React Query hook for fetching a single applicant
 */
export function useApplicantQuery(
  id: string | undefined,
  options?: Omit<
    UseQueryOptions<ApplicantDocument, Error>,
    'queryKey' | 'queryFn' | 'enabled'
  >
) {
  return useQuery({
    queryKey: discoveryKeys.applicantDetail(id ?? ''),
    queryFn: () => discoveryApi.getApplicant(id!),
    enabled: !!id,
    ...options,
  });
}

/**
 * React Query hook for searching applicants with filters
 * Supports pagination, filtering by location, skills, education, etc.
 */
export function useApplicantSearchQuery(
  params: ApplicantSearchParams,
  options?: Omit<UseQueryOptions<ApplicantPage, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: discoveryKeys.applicantSearch(params),
    queryFn: () => discoveryApi.searchApplicants(params),
    // Keep previous data while fetching new results
    placeholderData: (previousData) => previousData,
    ...options,
  });
}

// ============================================
// Search Profile Query Hooks
// ============================================

/**
 * React Query hook for fetching a single search profile
 */
export function useSearchProfileQuery(
  id: string | undefined,
  options?: Omit<
    UseQueryOptions<SearchProfile, Error>,
    'queryKey' | 'queryFn' | 'enabled'
  >
) {
  return useQuery({
    queryKey: discoveryKeys.searchProfileDetail(id ?? ''),
    queryFn: () => discoveryApi.getSearchProfile(id!),
    enabled: !!id,
    ...options,
  });
}

/**
 * React Query hook for fetching all search profiles for a company
 */
export function useSearchProfilesByCompanyQuery(
  companyId: string | undefined,
  options?: Omit<
    UseQueryOptions<SearchProfile[], Error>,
    'queryKey' | 'queryFn' | 'enabled'
  >
) {
  return useQuery({
    queryKey: discoveryKeys.searchProfilesByCompany(companyId ?? ''),
    queryFn: () => discoveryApi.getSearchProfilesByCompany(companyId!),
    enabled: !!companyId,
    ...options,
  });
}

// ============================================
// Search Profile Mutation Hooks
// ============================================

/**
 * React Query mutation for creating a search profile
 */
export function useCreateSearchProfileMutation(
  options?: Omit<
    UseMutationOptions<SearchProfile, Error, CreateSearchProfileRequest>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: discoveryApi.createSearchProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(
        discoveryKeys.searchProfileDetail(data.profileId),
        data
      );
      // Invalidate company's search profiles list
      queryClient.invalidateQueries({
        queryKey: discoveryKeys.searchProfilesByCompany(data.companyId),
      });
    },
    ...options,
  });
}

/**
 * React Query mutation for updating a search profile
 */
export function useUpdateSearchProfileMutation(
  options?: Omit<
    UseMutationOptions<
      SearchProfile,
      Error,
      { id: string; data: UpdateSearchProfileRequest }
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => discoveryApi.updateSearchProfile(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(
        discoveryKeys.searchProfileDetail(data.profileId),
        data
      );
      queryClient.invalidateQueries({
        queryKey: discoveryKeys.searchProfilesByCompany(data.companyId),
      });
    },
    ...options,
  });
}

/**
 * React Query mutation for deleting a search profile
 */
export function useDeleteSearchProfileMutation(
  companyId: string,
  options?: Omit<
    UseMutationOptions<{ success: boolean }, Error, string>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: discoveryApi.deleteSearchProfile,
    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: discoveryKeys.searchProfileDetail(id),
      });
      queryClient.invalidateQueries({
        queryKey: discoveryKeys.searchProfilesByCompany(companyId),
      });
    },
    ...options,
  });
}
