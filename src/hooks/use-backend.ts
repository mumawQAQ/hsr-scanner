import { create } from 'zustand'
import { createJSONStorage, persist, PersistOptions } from 'zustand/middleware'

export type AppState = 'idle' | 'requirement-ready' | 'ready'
export type PipelineType = 'SingleRelicAnalysisPipeline' | 'AutoRelicAnalysisPipeline'

type BackendStore = {
    pipelineType?: PipelineType
    setPipelineType: (type?: PipelineType) => void

    pipelineId?: string
    setPipelineId: (id?: string) => void

    backendPort?: number
    setBackendPort: (port?: number) => void

    appState: AppState
    setAppState: (state: AppState) => void
}

const persistConfig: PersistOptions<BackendStore> = {
    name: 'backend-store',
    storage: createJSONStorage(() => sessionStorage),
}

export const useBackend = create<BackendStore>()(
    persist(
        (set) => ({
            pipelineType: undefined,
            setPipelineType: (type?: PipelineType) => set({ pipelineType: type }),
            pipelineId: undefined,
            setPipelineId: (id?: string) => set({ pipelineId: id }),
            backendPort: undefined,
            setBackendPort: (port?: number) => set({ backendPort: port }),
            appState: 'idle',
            setAppState: (state: AppState) => set({ appState: state }),
        }),
        persistConfig
    )
)
