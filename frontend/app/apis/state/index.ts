import { useMutation } from '@tanstack/react-query';
import useBackendClientStore from '@/app/hooks/use-backend-client-store';
import { MousePositionRequest } from '@/app/types/api-types';

export const useUpdateFullLogState = () => {
  const { api } = useBackendClientStore();
  return useMutation({
    async mutationFn(state: boolean) {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const url = `full-log/${state}`;
        const { data } = await api.patch(url);
        return data;
      } catch (error) {
        console.error('Failed to update full log state:', error);
        throw error;
      }
    },
  });
};

export const useMousePosition = () => {
  const { api } = useBackendClientStore();
  return useMutation({
    async mutationFn(mousePosition: MousePositionRequest) {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const { data } = await api.post('mouse-position', mousePosition);
        return data;
      } catch (error) {
        console.error('Failed to update mouse position:', error);
        throw error;
      }
    },
  });
};


