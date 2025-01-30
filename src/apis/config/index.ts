import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import {
    ApiResponse,
    DiscardIconPositionRequest,
    DiscardIconPositionResponse,
    RelicBoxPositionRequest,
    RelicBoxPositionResponse,
    RelicBoxPositionType,
} from '@/types/api-types'
import { useBackend } from '@/hooks/use-backend.ts'
import { getBackendUrl } from '@/lib/utils.ts'

export const useAnalysisFailSkip = () => {
    const { backendPort } = useBackend()
    return useQuery({
        queryKey: ['analysis-fail-skip'],
        queryFn: async () => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.get<ApiResponse<boolean>>(
                    `${getBackendUrl(backendPort)}/config/analysis-fail-skip`
                )

                if (data.status !== 'success') {
                    throw new Error(data.message)
                }

                return data.data
            } catch (error) {
                console.error('Failed to fetch analysis-fail-skip:', error)
                throw error
            }
        },
    })
}

export const useUpdateAnalysisFailSkip = () => {
    const { backendPort } = useBackend()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (analysisFailSkip: boolean) => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }
            try {
                const { data } = await axios.patch<ApiResponse<string>>(
                    `${getBackendUrl(backendPort)}/config/analysis-fail-skip/${analysisFailSkip}`
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }

                return data.data
            } catch (error) {
                console.error('Failed to update analysis-fail-skip:', error)
                throw error
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['analysis-fail-skip'],
            })
        },
    })
}

export const useRelicDiscardScore = () => {
    const { backendPort } = useBackend()
    return useQuery({
        queryKey: ['relic-discard-score'],
        queryFn: async () => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.get<ApiResponse<number>>(
                    `${getBackendUrl(backendPort)}/config/relic-discard-score`
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }

                return data.data
            } catch (error) {
                console.error('Failed to fetch relic-discard-score:', error)
                throw error
            }
        },
    })
}

export const useUpdateRelicDiscardScore = () => {
    const { backendPort } = useBackend()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (relicDiscardScore: number) => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.patch<ApiResponse<string>>(
                    `${getBackendUrl(backendPort)}/config/relic-discard-score/${relicDiscardScore}`
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }

                return data.data
            } catch (error) {
                console.error('Failed to update relic-discard-score:', error)
                throw error
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['relic-discard-score'],
            })
        },
    })
}

export const useAutoDetectDiscardIcon = () => {
    const { backendPort } = useBackend()
    return useQuery({
        queryKey: ['auto-detect-discard-icon'],
        queryFn: async () => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.get<ApiResponse<boolean>>(
                    `${getBackendUrl(backendPort)}/config/auto-detect-discard-icon`
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }

                return data.data
            } catch (error) {
                console.error('Failed to fetch auto-detect-discard-icon:', error)
                throw error
            }
        },
    })
}

export const useUpdateAutoDetectDiscardIcon = () => {
    const { backendPort } = useBackend()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (autoDetectDiscardIcon: boolean) => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.patch<ApiResponse<string>>(
                    `${getBackendUrl(backendPort)}/config/auto-detect-discard-icon/${autoDetectDiscardIcon}`
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }

                return data.data
            } catch (error) {
                console.error('Failed to update auto-detect-discard-icon:', error)
                throw error
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['auto-detect-discard-icon'],
            })
        },
    })
}

export const useDiscardIconPosition = () => {
    const { backendPort } = useBackend()
    return useQuery({
        queryKey: ['discard-icon-position'],
        queryFn: async () => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.get<ApiResponse<DiscardIconPositionResponse>>(
                    `${getBackendUrl(backendPort)}/config/discard-icon-position`
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }

                return data.data
            } catch (error) {
                console.error('Failed to fetch discard-icon-position:', error)
                throw error
            }
        },
    })
}

export const useUpdateDiscardIconPosition = () => {
    const { backendPort } = useBackend()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (discardIconPosition: DiscardIconPositionRequest) => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.post<ApiResponse<string>>(
                    `${getBackendUrl(backendPort)}/config/discard-icon-position`,
                    discardIconPosition
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }

                return data.data
            } catch (error) {
                console.error('Failed to update discard-icon-position:', error)
                throw error
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['discard-icon-position'],
            })
        },
    })
}

export const useAutoDetectRelicBoxPosition = () => {
    const { backendPort } = useBackend()
    return useQuery({
        queryKey: ['auto-detect-relic-box-position'],
        queryFn: async () => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.get<ApiResponse<boolean>>(
                    `${getBackendUrl(backendPort)}/config/auto-detect-relic-box`
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }

                return data.data
            } catch (error) {
                console.error('Failed to fetch auto-detect-relic-box-position:', error)
                throw error
            }
        },
    })
}

export const useUpdateAutoDetectRelicBoxPosition = () => {
    const { backendPort } = useBackend()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (autoDetectRelicBoxPosition: boolean) => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.patch<ApiResponse<string>>(
                    `${getBackendUrl(backendPort)}/config/auto-detect-relic-box/${autoDetectRelicBoxPosition}`
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }

                return data.data
            } catch (error) {
                console.error('Failed to update auto-detect-relic-box-position:', error)
                throw error
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['auto-detect-relic-box-position'],
            })
        },
    })
}

export const useRelicBoxPosition = (relicBoxPositionType: RelicBoxPositionType) => {
    const { backendPort } = useBackend()
    return useQuery({
        queryKey: ['relic-box-position', relicBoxPositionType],
        queryFn: async () => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.get<ApiResponse<RelicBoxPositionResponse>>(
                    `${getBackendUrl(backendPort)}/config/relic-box-position/${relicBoxPositionType}`
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }

                return data.data
            } catch (error) {
                console.error('Failed to fetch relic box position:', error)
                throw error
            }
        },
    })
}

export const useUpdateRelicBoxPosition = () => {
    const { backendPort } = useBackend()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (relicBoxPosition: RelicBoxPositionRequest) => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.post<ApiResponse<string>>(
                    `${getBackendUrl(backendPort)}/config/relic-box-position`,
                    relicBoxPosition
                )
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }

                return data.data
            } catch (error) {
                console.error('Failed to update relic box position:', error)
                throw error
            }
        },
        onSuccess: async (_, data) => {
            await queryClient.invalidateQueries({ queryKey: ['relic-box-position', data.type] })
        },
    })
}
