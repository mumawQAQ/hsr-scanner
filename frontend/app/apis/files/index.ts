import useBackendClientStore from '@/app/hooks/use-backend-client-store';
import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from '@/app/types/api-types';

export const useJsonFile = (filePath: string) => {
  const { api } = useBackendClientStore();
  return useQuery({
    queryKey: ['json', filePath],
    queryFn: async () => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const { data } = await api.post<ApiResponse<string>>('files', {
          file_path: filePath,
          file_type: 'json',
        });
        if (data.status !== 'success') {
          throw new Error(data.message);
        }

        return data.data ? JSON.parse(data.data) : null;
      } catch (error) {
        console.error('Failed to fetch file:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useImage = (imagePath: string) => {
  const { api } = useBackendClientStore();
  return useQuery({
    queryKey: ['image', imagePath],
    queryFn: async () => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const { data } = await api.post<ApiResponse<string>>('files', {
          file_path: imagePath,
          file_type: 'img',
        });
        if (data.status !== 'success') {
          throw new Error(data.message);
        }

        return data.data;
      } catch (error) {
        console.error('Failed to fetch image:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};
