import useBackendClientStore from '@/app/hooks/use-backend-client-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ApiResponse,
  DiscardIconPositionRequest,
  DiscardIconPositionResponse,
  RelicBoxPositionRequest,
  RelicBoxPositionResponse,
  RelicBoxPositionType,
} from '@/app/types/api-types';

export const useAnalysisFailSkip = () => {
  const { api } = useBackendClientStore();
  return useQuery({
    queryKey: ['analysis-fail-skip'],
    queryFn: async () => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const { data } = await api.get<ApiResponse<boolean>>('config/analysis-fail-skip');
        if (data.status !== 'success') {
          throw new Error(data.message);
        }

        return data.data;
      } catch (error) {
        console.error('Failed to fetch analysis-fail-skip:', error);
        throw error;
      }
    },
  });
};

export const useUpdateAnalysisFailSkip = () => {
  const { api } = useBackendClientStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (analysisFailSkip: boolean) => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const { data } = await api.patch<ApiResponse<string>>(`config/analysis-fail-skip/${analysisFailSkip}`);
        if (data.status !== 'success') {
          throw new Error(data.message);
        }

        return data.data;
      } catch (error) {
        console.error('Failed to update analysis-fail-skip:', error);
        throw error;
      }

    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['analysis-fail-skip'],
      });
    },
  });
};


export const useRelicDiscardScore = () => {
  const { api } = useBackendClientStore();
  return useQuery({
    queryKey: ['relic-discard-score'],
    queryFn: async () => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const { data } = await api.get<ApiResponse<number>>('config/relic-discard-score');
        if (data.status !== 'success') {
          throw new Error(data.message);
        }

        return data.data;
      } catch (error) {
        console.error('Failed to fetch relic-discard-score:', error);
        throw error;
      }

    },
  });
};

export const useUpdateRelicDiscardScore = () => {
  const { api } = useBackendClientStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (relicDiscardScore: number) => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const { data } = await api.patch<ApiResponse<string>>(`config/relic-discard-score/${relicDiscardScore}`);
        if (data.status !== 'success') {
          throw new Error(data.message);
        }

        return data.data;
      } catch (error) {
        console.error('Failed to update relic-discard-score:', error);
        throw error;
      }

    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['relic-discard-score'],
      });
    },
  });
};

export const useAutoDetectDiscardIcon = () => {
  const { api } = useBackendClientStore();
  return useQuery({
    queryKey: ['auto-detect-discard-icon'],
    queryFn: async () => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const { data } = await api.get<ApiResponse<boolean>>('config/auto-detect-discard-icon');
        if (data.status !== 'success') {
          throw new Error(data.message);
        }

        return data.data;
      } catch (error) {
        console.error('Failed to fetch auto-detect-discard-icon:', error);
        throw error;
      }

    },
  });
};

export const useUpdateAutoDetectDiscardIcon = () => {
  const { api } = useBackendClientStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (autoDetectDiscardIcon: boolean) => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const { data } = await api.patch<ApiResponse<string>>(`config/auto-detect-discard-icon/${autoDetectDiscardIcon}`);
        if (data.status !== 'success') {
          throw new Error(data.message);
        }

        return data.data;
      } catch (error) {
        console.error('Failed to update auto-detect-discard-icon:', error);
        throw error;
      }

    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['auto-detect-discard-icon'],
      });
    },
  });
};

export const useDiscardIconPosition = () => {
  const { api } = useBackendClientStore();
  return useQuery({
    queryKey: ['discard-icon-position'],
    queryFn: async () => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const { data } = await api.get<ApiResponse<DiscardIconPositionResponse>>('config/discard-icon-position');
        if (data.status !== 'success') {
          throw new Error(data.message);
        }

        return data.data;
      } catch (error) {
        console.error('Failed to fetch discard-icon-position:', error);
        throw error;
      }

    },
  });
};

export const useUpdateDiscardIconPosition = () => {
  const { api } = useBackendClientStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (discardIconPosition: DiscardIconPositionRequest) => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const { data } = await api.post<ApiResponse<string>>(`config/discard-icon-position`, discardIconPosition);
        if (data.status !== 'success') {
          throw new Error(data.message);
        }

        return data.data;
      } catch (error) {
        console.error('Failed to update discard-icon-position:', error);
        throw error;
      }

    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['discard-icon-position'],
      });
    },
  });
};

export const useAutoDetectRelicBoxPosition = () => {
  const { api } = useBackendClientStore();
  return useQuery({
    queryKey: ['auto-detect-relic-box-position'],
    queryFn: async () => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const { data } = await api.get<ApiResponse<boolean>>('config/auto-detect-relic-box');
        if (data.status !== 'success') {
          throw new Error(data.message);
        }

        return data.data;
      } catch (error) {
        console.error('Failed to fetch auto-detect-relic-box-position:', error);
        throw error;
      }

    },
  });
};

export const useUpdateAutoDetectRelicBoxPosition = () => {
  const { api } = useBackendClientStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (autoDetectRelicBoxPosition: boolean) => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const { data } = await api.patch<ApiResponse<string>>(`config/auto-detect-relic-box/${autoDetectRelicBoxPosition}`);
        if (data.status !== 'success') {
          throw new Error(data.message);
        }

        return data.data;
      } catch (error) {
        console.error('Failed to update auto-detect-relic-box-position:', error);
        throw error;
      }

    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['auto-detect-relic-box-position'],
      });
    },
  });
};


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