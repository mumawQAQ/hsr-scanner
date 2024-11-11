import { useMutation } from '@tanstack/react-query';
import useBackendClientStore from '@/app/hooks/use-backend-client-store';

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


