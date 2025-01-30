import React, { createContext, useEffect } from 'react'
import { useModal } from '@/hooks/use-modal.ts'
import { useBackend } from '@/hooks/use-backend.ts'
import { invoke } from '@tauri-apps/api/core'

type SetupProviderProps = {
    children: React.ReactNode
}

const SetupProviderContext = createContext({})

export function SetupProvider({ children, ...props }: SetupProviderProps) {
    const { onOpen, onClose } = useModal()
    const backendStore = useBackend()

    useEffect(() => {
        console.log(backendStore.appState)
        if (backendStore.appState === 'idle') {
            invoke('post_backup').catch((e) => console.error('Failed to restore backup file:', e))
            onOpen('install-requirement')
        } else if (backendStore.appState === 'requirement-ready') {
            onOpen('start-backend')
        } else if (backendStore.appState === 'ready') {
            onClose()
        }
    }, [backendStore.appState])

    return (
        <SetupProviderContext.Provider {...props} value={{}}>
            {children}
        </SetupProviderContext.Provider>
    )
}
