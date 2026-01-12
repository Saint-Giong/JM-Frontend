'use client';

import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  type SkillTag,
  type SkillTagListParams,
  type SkillTagPage,
  skillTagApi,
} from '@/lib/api/tag';

// Query keys factory
export const skillTagKeys = {
  all: ['skill-tags'] as const,
  lists: () => [...skillTagKeys.all, 'list'] as const,
  list: (params?: SkillTagListParams) =>
    [...skillTagKeys.lists(), params] as const,
  search: (prefix: string) => [...skillTagKeys.all, 'search', prefix] as const,
  detail: (id: number) => [...skillTagKeys.all, id] as const,
};

/**
 * React Query hook for fetching paginated skill tags
 */
export function useSkillTagsQuery(
  params?: SkillTagListParams,
  options?: Omit<UseQueryOptions<SkillTagPage, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: skillTagKeys.list(params),
    queryFn: () => skillTagApi.getAll(params),
    ...options,
  });
}

/**
 * React Query hook for fetching a single skill tag
 */
export function useSkillTagQuery(
  id: number | undefined,
  options?: Omit<
    UseQueryOptions<SkillTag, Error>,
    'queryKey' | 'queryFn' | 'enabled'
  >
) {
  return useQuery({
    queryKey: skillTagKeys.detail(id ?? 0),
    queryFn: () => skillTagApi.get(id!),
    enabled: id !== undefined,
    ...options,
  });
}

/**
 * React Query hook for searching skill tags (autocomplete)
 * Includes debounce-friendly staleTime
 */
export function useSkillTagSearchQuery(
  prefix: string,
  options?: Omit<
    UseQueryOptions<SkillTag[], Error>,
    'queryKey' | 'queryFn' | 'enabled'
  >
) {
  return useQuery({
    queryKey: skillTagKeys.search(prefix),
    queryFn: () => skillTagApi.search({ prefix }),
    enabled: prefix.length >= 1, // Only search when there's input
    staleTime: 30 * 1000, // Cache autocomplete results for 30 seconds
    ...options,
  });
}

/**
 * React Query mutation for creating a skill tag
 */
export function useCreateSkillTagMutation(
  options?: Omit<
    UseMutationOptions<SkillTag, Error, { name: string }>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skillTagApi.create,
    onSuccess: (data) => {
      queryClient.setQueryData(skillTagKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: skillTagKeys.lists() });
    },
    ...options,
  });
}

/**
 * React Query mutation for updating a skill tag
 */
export function useUpdateSkillTagMutation(
  options?: Omit<
    UseMutationOptions<SkillTag, Error, { id: number; name: string }>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }) => skillTagApi.update(id, { name }),
    onSuccess: (data) => {
      queryClient.setQueryData(skillTagKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: skillTagKeys.lists() });
      // Invalidate search queries as the tag name might have changed
      queryClient.invalidateQueries({
        queryKey: [...skillTagKeys.all, 'search'],
      });
    },
    ...options,
  });
}

/**
 * React Query mutation for deleting a skill tag
 */
export function useDeleteSkillTagMutation(
  options?: Omit<
    UseMutationOptions<{ success: boolean }, Error, number>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skillTagApi.delete,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: skillTagKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: skillTagKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: [...skillTagKeys.all, 'search'],
      });
    },
    ...options,
  });
}
