import { useQuery } from '@tanstack/react-query'
import { ApiResponse } from '@/types/api-types'
import { useBackend } from '@/hooks/use-backend.ts'
import axios from 'axios'
import { getBackendUrl } from '@/lib/utils'

export const useJsonFile = (filePath: string) => {
    const { backendPort } = useBackend()
    return useQuery({
        queryKey: ['json', filePath],
        queryFn: async () => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.post<ApiResponse<string>>(`${getBackendUrl(backendPort)}/files`, {
                    file_path: filePath,
                    file_type: 'json',
                })

                if (data.status !== 'success') {
                    throw new Error(data.message)
                }

                return data.data ? JSON.parse(data.data) : null
            } catch (error) {
                console.error('Failed to fetch file:', error)
                throw error
            }
        },
        staleTime: Infinity,
        gcTime: Infinity,
    })
}

export const useImage = (imagePath: string) => {
    const { backendPort } = useBackend()
    return useQuery({
        queryKey: ['image', imagePath],
        queryFn: async () => {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.post<ApiResponse<string>>(`${getBackendUrl(backendPort)}/files`, {
                    file_path: imagePath,
                    file_type: 'img',
                })
                if (data.status !== 'success') {
                    throw new Error(data.message)
                }

                return data.data
            } catch (error) {
                console.error('Failed to fetch image:', error)
                throw error
            }
        },
        staleTime: Infinity,
        gcTime: Infinity,
    })
}
