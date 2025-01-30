import { useMutation } from '@tanstack/react-query'
import { MousePositionRequest } from '@/types/api-types'
import { useBackend } from '@/hooks/use-backend.ts'
import axios from 'axios'
import { getBackendUrl } from '@/lib/utils.ts'

export const useUpdateFullLogState = () => {
    const { backendPort } = useBackend()
    return useMutation({
        async mutationFn(state: boolean) {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.patch(`${getBackendUrl(backendPort)}/full-log/${state}`)
                return data
            } catch (error) {
                console.error('Failed to update full log state:', error)
                throw error
            }
        },
    })
}

export const useMousePosition = () => {
    const { backendPort } = useBackend()
    return useMutation({
        async mutationFn(mousePosition: MousePositionRequest) {
            if (!backendPort) {
                throw new Error('API not initialized')
            }

            try {
                const { data } = await axios.post(`${getBackendUrl(backendPort)}/mouse-position`, mousePosition)
                return data
            } catch (error) {
                console.error('Failed to update mouse position:', error)
                throw error
            }
        },
    })
}
