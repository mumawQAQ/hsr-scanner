import useBackendClientStore from '@/app/hooks/use-backend-client-store';
import { useMutation } from '@tanstack/react-query';
import { StartPipelineRequest } from '@/app/types/api-types';

export const useStopPipeline = () => {
  const { api } = useBackendClientStore();
  return useMutation({
    async mutationFn(pipeLineId: string | null) {
      if (!api) {
        throw new Error('API not initialized');
      }

      if (!pipeLineId) {
        throw new Error('Pipeline ID is required');
      }

      try {
        const url = `pipeline/stop`;
        const { data } = await api.post(url, {
          pipeline_id: pipeLineId,
        });
        return data;
      } catch (error) {
        console.error('Failed to update scan state:', error);
        throw error;
      }
    },
  });
};

export const useStartPipeline = () => {
  const { api } = useBackendClientStore();
  return useMutation({
    async mutationFn(startPipelineRequest: StartPipelineRequest) {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const url = `pipeline/start`;
        const { data } = await api.post(url, {
          pipeline_name: startPipelineRequest.pipeline_name,
          meta_data: startPipelineRequest.meta_data || {},
        });
        return data;
      } catch (error) {
        console.error('Failed to update scan state:', error);
        throw error;
      }
    },
  });
};