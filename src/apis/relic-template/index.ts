import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { RelicTemplate } from '@/types/relic-template-types'
import { RelicRule } from '@/types/relic-rule-type'
import { useBackend } from '@/hooks/use-backend'
import {
    ApiResponse,
    CreateRelicRuleRequest,
    CreateRelicTemplateRequest,
    DeleteRelicRuleRequest,
    UpdateRelicRuleRequest,
} from '@/types/api-types'
import { getBackendUrl } from '@/lib/utils'

export const useCreateTemplate = () => {
    const { backendPort } = useBackend()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (template: CreateRelicTemplateRequest) => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.put<ApiResponse<RelicTemplate>>(
                    `${getBackendUrl(backendPort)}/rating-template/create`,
                    template
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }
            } catch (error) {
                console.error('Failed to create relic template:', error)
                throw error
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['relic-template-list'] })
        },
    })
}

export const useDeleteTemplate = () => {
    const { backendPort } = useBackend()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (templateId: string) => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.delete<ApiResponse<null>>(
                    `${getBackendUrl(backendPort)}/rating-template/delete/${templateId}`
                )

                if (data.status !== 'success') {
                    throw new Error(data.message)
                }
            } catch (error) {
                console.error('Failed to delete relic template:', error)
                throw error
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['relic-template-list'] })
        },
    })
}

export const useUnselectTemplate = () => {
    const { backendPort } = useBackend()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (templateId: string) => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.patch<ApiResponse<null>>(
                    `${getBackendUrl(backendPort)}/rating-template/stop-use/${templateId}`
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }
            } catch (error) {
                console.error('Failed to select relic template:', error)
                throw error
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['relic-template-list'] })
        },
    })
}

export const useSelectTemplate = () => {
    const { backendPort } = useBackend()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (templateId: string) => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.patch<ApiResponse<null>>(
                    `${getBackendUrl(backendPort)}/rating-template/use/${templateId}`
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }
            } catch (error) {
                console.error('Failed to select relic template:', error)
                throw error
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['relic-template-list'] })
        },
    })
}

export const useRelicTemplateList = () => {
    const { backendPort } = useBackend()
    return useQuery({
        queryKey: ['relic-template-list'],
        queryFn: async () => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.get<ApiResponse<RelicTemplate[]>>(
                    `${getBackendUrl(backendPort)}/rating-template/list`
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }
                return data.data
            } catch (error) {
                console.error('Failed to fetch relic template list:', error)
                throw error
            }
        },
    })
}

export const useCreateRelicRule = () => {
    const { backendPort } = useBackend()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (newRule: CreateRelicRuleRequest) => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.put<ApiResponse<RelicRule>>(
                    `${getBackendUrl(backendPort)}/rating-template/rule/create`,
                    newRule
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }

                return data.data
            } catch (error) {
                console.error('Failed to create relic rule:', error)
                throw error
            }
        },
        onSuccess: async (_, data) => {
            await queryClient.invalidateQueries({ queryKey: ['relic-rule-list', data.template_id] })
        },
    })
}

export const useDeleteRelicRule = () => {
    const { backendPort } = useBackend()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (request: DeleteRelicRuleRequest) => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.delete<ApiResponse<null>>(
                    `${getBackendUrl(backendPort)}/rating-template/rule/delete/${request.rule_id}`
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }
            } catch (error) {
                console.error('Failed to delete relic rule:', error)
                throw error
            }
        },
        onSuccess: async (_, data) => {
            await queryClient.invalidateQueries({ queryKey: ['relic-rule-list', data.template_id] })
        },
    })
}

export const useRelicRule = (ruleId: string) => {
    const { backendPort } = useBackend()
    return useQuery({
        queryKey: ['relic-rule', ruleId],
        queryFn: async () => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.get<ApiResponse<RelicRule>>(
                    `${getBackendUrl(backendPort)}/rating-template/rule/${ruleId}`
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }
                return data.data
            } catch (error) {
                console.error('Failed to fetch relic rule:', error)
                throw error
            }
        },
    })
}

export const useRelicRuleList = (templateId: string | null) => {
    const { backendPort } = useBackend()
    return useQuery({
        queryKey: ['relic-rule-list', templateId],
        queryFn: async () => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.get<ApiResponse<RelicRule[]>>(
                    `${getBackendUrl(backendPort)}/rating-template/rule/list/${templateId}`
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }
                return data.data
            } catch (error) {
                console.error('Failed to fetch relic rule list:', error)
                throw error
            }
        },
        enabled: !!templateId,
    })
}

export const useUpdateRelicRule = () => {
    const { backendPort } = useBackend()
    const queryClient = useQueryClient()

    return useMutation<undefined, Error, UpdateRelicRuleRequest, { previousRule: RelicRule | undefined }>({
        mutationFn: async (rule: UpdateRelicRuleRequest) => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            // Real server update:
            const { data } = await axios.post<ApiResponse<RelicRule>>(
                `${getBackendUrl(backendPort)}/rating-template/rule/update`,
                rule
            )
            if (data.status !== 'success') {
                throw new Error(data.message)
            }
        },

        onMutate: async (rule: UpdateRelicRuleRequest) => {
            // Cancel any refetches so they don't overwrite optimistic update
            await queryClient.cancelQueries({ queryKey: ['relic-rule', rule.id] })

            // Snapshot the current data
            const previousRule = queryClient.getQueryData<RelicRule>(['relic-rule', rule.id])
            // Optimistically update the cache
            // e.g. merge old data + new fields from the rule
            queryClient.setQueryData<RelicRule>(['relic-rule', rule.id], rule)

            // Return context for potential rollback
            return { previousRule }
        },

        onError: (error, newRule, context) => {
            if (context?.previousRule) {
                queryClient.setQueryData(['relic-rule', newRule.id], context.previousRule.id)
            }
            console.error('Failed to update relic rule:', error)
        },

        onSettled: (_rule, _error, newRule) => {
            if (newRule?.id) {
                queryClient.invalidateQueries({ queryKey: ['relic-rule-list', newRule?.id] })
            }
        },
    })
}

export const useExportTemplate = () => {
    const { backendPort } = useBackend()
    return useMutation({
        mutationFn: async (templateId: string) => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.get<ApiResponse<string>>(
                    `${getBackendUrl(backendPort)}/rating-template/export/${templateId}`
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }
                return data.data
            } catch (error) {
                console.error('Failed to export relic template:', error)
                throw error
            }
        },
    })
}

export const useImportTemplate = () => {
    const { backendPort } = useBackend()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (qrCodeData: string) => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.post<ApiResponse<null>>(
                    `${getBackendUrl(backendPort)}/rating-template/import`,
                    {
                        qr_code: qrCodeData,
                    }
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }
            } catch (error) {
                console.error('Failed to import relic template:', error)
                throw error
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['relic-template-list'] })
        },
    })
}
