import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useBackendClientStore from '@/app/hooks/use-backend-client-store';
import {
  ApiResponse,
  CreateRelicRuleRequest,
  CreateRelicTemplateRequest,
  DeleteRelicRuleRequest,
  UpdateRelicRuleRequest,
} from '@/app/types/api-types';
import { RelicTemplate } from '@/app/types/relic-template-types';
import { RelicRule, RelicRuleIds } from '@/app/types/relic-rule-type';

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

export const useUnselectTemplate = () => {
  const { api } = useBackendClientStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (templateId: string) => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const url = `/rating-template/stop-use/${templateId}`;
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

export const useCreateRelicRule = () => {
  const { api } = useBackendClientStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newRule: CreateRelicRuleRequest) => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const url = `/rating-template/rule/create`;
        const { data } = await api.put<ApiResponse<RelicRule>>(url, newRule);
        if (data.status !== 'success') {
          throw new Error(data.message);
        }

        return data.data;
      } catch (error) {
        console.error('Failed to create relic rule:', error);
        throw error;
      }
    },
    onSuccess: async (_, data) => {
      await queryClient.invalidateQueries({ queryKey: ['relic-rule-list', data.template_id] });
    },
  });
};

export const useDeleteRelicRule = () => {
  const { api } = useBackendClientStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: DeleteRelicRuleRequest) => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const url = `/rating-template/rule/delete/${request.rule_id}`;
        const { data } = await api.delete<ApiResponse<null>>(url);
        if (data.status !== 'success') {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Failed to delete relic rule:', error);
        throw error;
      }
    },
    onSuccess: async (_, data) => {
      await queryClient.invalidateQueries({ queryKey: ['relic-rule-list', data.template_id] });
    },
  });
};

export const useRelicRule = (ruleId: string) => {
  const { api } = useBackendClientStore();
  return useQuery({
    queryKey: ['relic-rule', ruleId],
    queryFn: async () => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const url = `/rating-template/rule/${ruleId}`;
        const { data } = await api.get<ApiResponse<RelicRule>>(url);
        if (data.status !== 'success') {
          throw new Error(data.message);
        }
        return data.data;
      } catch (error) {
        console.error('Failed to fetch relic rule:', error);
        throw error;
      }
    },
  });
};

export const useRelicRuleList = (templateId: string | null) => {
  const { api } = useBackendClientStore();
  return useQuery({
    queryKey: ['relic-rule-list', templateId],
    queryFn: async () => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const url = `/rating-template/rule/list/${templateId}`;
        const { data } = await api.get<ApiResponse<RelicRuleIds[]>>(url);
        if (data.status !== 'success') {
          throw new Error(data.message);
        }
        return data.data;
      } catch (error) {
        console.error('Failed to fetch relic rule list:', error);
        throw error;
      }
    },
    enabled: !!templateId,
  });
};

export const useUpdateRelicRule = () => {
  const { api } = useBackendClientStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rule: UpdateRelicRuleRequest) => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const url = `/rating-template/rule/update`;
        const { data } = await api.post<ApiResponse<RelicRule>>(url, rule);
        if (data.status !== 'success') {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Failed to update relic rule:', error);
        throw error;
      }
    },
    onSuccess: async (_, data) => {
      await queryClient.invalidateQueries({ queryKey: ['relic-rule-list', data.template_id] });
    },
  });
};

export const useExportTemplate = () => {
  const { api } = useBackendClientStore();
  return useMutation({
    mutationFn: async (templateId: string) => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const url = `/rating-template/export/${templateId}`;
        const { data } = await api.get<ApiResponse<string>>(url);
        if (data.status !== 'success') {
          throw new Error(data.message);
        }
        return data.data;
      } catch (error) {
        console.error('Failed to export relic template:', error);
        throw error;
      }
    },
  });
};

export const useImportTemplate = () => {
  const { api } = useBackendClientStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (qrCodeData: string) => {
      if (!api) {
        throw new Error('API not initialized');
      }

      try {
        const url = `/rating-template/import`;
        const { data } = await api.post<ApiResponse<null>>(url, { qr_code: qrCodeData });
        if (data.status !== 'success') {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Failed to import relic template:', error);
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['relic-template-list'] });
    },
  });
};