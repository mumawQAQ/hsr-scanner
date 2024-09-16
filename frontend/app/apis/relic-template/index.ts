import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useBackendClientStore from '@/app/hooks/use-backend-client-store';
import { ApiResponse, CreateRelicTemplateRequest } from '@/app/types/api-types';
import { RelicTemplate } from '@/app/types/relic-template-types';

export const useCreateTemplate = () => {
  const { api } = useBackendClientStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (template: CreateRelicTemplateRequest) => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const url = `/rating-template/create`;
        const { data } = await api.put<ApiResponse<RelicTemplate>>(url, template);
        if (data.status !== 'success') {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Failed to create relic template:', error);
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['relic-template-list'] });
    },
  });
};

export const useDeleteTemplate = () => {
  const { api } = useBackendClientStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (templateId: string) => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const url = `/rating-template/delete/${templateId}`;
        const { data } = await api.delete<ApiResponse<null>>(url);
        if (data.status !== 'success') {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Failed to delete relic template:', error);
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['relic-template-list'] });
    },
  });
};

export const useSelectTemplate = () => {
  const { api } = useBackendClientStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (templateId: string) => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const url = `/rating-template/use/${templateId}`;
        const { data } = await api.patch<ApiResponse<null>>(url);
        if (data.status !== 'success') {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Failed to select relic template:', error);
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['relic-template-list'] });
    },
  });
};

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
