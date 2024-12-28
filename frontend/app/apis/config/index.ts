import useBackendClientStore from '@/app/hooks/use-backend-client-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ApiResponse,
  RelicBoxPositionRequest,
  RelicBoxPositionResponse,
  RelicBoxPositionType,
} from '@/app/types/api-types';

export const useRelicBoxPosition = (relicBoxPositionType: RelicBoxPositionType) => {
  const { api } = useBackendClientStore();
  return useQuery({
    queryKey: ['relic-box-position', relicBoxPositionType],
    queryFn: async () => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const { data } = await api.get<ApiResponse<RelicBoxPositionResponse>>(`config/relic-box-position/${relicBoxPositionType}`);
        if (data.status !== 'success') {
          throw new Error(data.message);
        }

        return data.data;
      } catch (error) {
        console.error('Failed to fetch relic box position:', error);
        throw error;
      }

    },
  });
};

export const useUpdateRelicBoxPosition = () => {
  const { api } = useBackendClientStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (relicBoxPosition: RelicBoxPositionRequest) => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const { data } = await api.post<ApiResponse<string>>('config/relic-box-position', relicBoxPosition);
        if (data.status !== 'success') {
          throw new Error(data.message);
        }

        return data.data;
      } catch (error) {
        console.error('Failed to update relic box position:', error);
        throw error;
      }

    },
    onSuccess: async (_, data) => {
      await queryClient.invalidateQueries({ queryKey: ['relic-box-position', data.type] });
    },

  });
};