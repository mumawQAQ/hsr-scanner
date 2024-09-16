import { useQuery } from '@tanstack/react-query';
import useBackendClientStore from '@/app/hooks/use-backend-client-store';
import { ApiResponse } from '@/app/types/api-types';
import { RelicTemplate } from '@/app/types/relic-template-types';

export const useRelicTemplateList = () => {
  const { api } = useBackendClientStore();
  return useQuery({
    queryKey: ['relic-template-list'],
    queryFn: async () => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const { data } = await api.get<ApiResponse<RelicTemplate[]>>('rating-template/list');
        if (data.status !== 'success') {
          throw new Error(data.message);
        }
        return data.data;
      } catch (error) {
        console.error('Failed to fetch relic template list:', error);
        throw error;
      }
    },
  });
};
