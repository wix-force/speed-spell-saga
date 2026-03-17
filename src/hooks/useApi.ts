import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

// Generic hooks for API calls
export function useApiQuery<T>(key: string[], url: string, options?: { enabled?: boolean }) {
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await apiClient.get(url);
      return data.data;
    },
    ...options,
  });
}

export function useApiMutation<TData = any, TBody = any>(
  url: string,
  method: 'post' | 'patch' | 'delete' = 'post',
  invalidateKeys?: string[][]
) {
  const queryClient = useQueryClient();
  return useMutation<TData, Error, TBody>({
    mutationFn: async (body) => {
      const { data } = await apiClient[method](url, body);
      return data.data;
    },
    onSuccess: () => {
      invalidateKeys?.forEach(key => queryClient.invalidateQueries({ queryKey: key }));
    },
  });
}
