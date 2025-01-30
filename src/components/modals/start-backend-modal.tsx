import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog.tsx'
import { LogViewer } from '@patternfly/react-log-viewer'
import { useEffect, useState } from 'react'
import { useModal } from '@/hooks/use-modal.ts'
import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/core'
import { toast } from 'sonner'
import { useBackend } from '@/hooks/use-backend.ts'

const StartBackendModal = () => {
    const [logQueue, setLogQueue] = useState<string[]>([])
    const backendStore = useBackend()
    const { isOpen, type } = useModal()

    const isModalOpen = isOpen && type === 'start-backend'

    useEffect(() => {
        if (!isModalOpen) {
            return
        }
        const startAndListen = async () => {
            try {
                // Listen for 'backend-log' events
                const logUnlistener = await listen<string>('backend-log', (event) => {
                    setLogQueue((prevState) => [...prevState, event.payload])
                })

                // Listen for 'backend-error' events
                const errorUnlistener = await listen<string>('backend-error', (event) => {
                    setLogQueue((prevState) => [...prevState, event.payload])
                })

                // Listen for 'backend-port' events
                const portUnlistener = await listen<string>('backend-port', (event) => {
                    backendStore.setBackendPort(parseInt(event.payload))
                    backendStore.setAppState('ready')
                })

                await invoke('start_backend') // Start the backend process

                // Return cleanup function to remove event listeners
                return () => {
                    logUnlistener()
                    errorUnlistener()
                    portUnlistener()
                }
            } catch (e) {
                console.error('Error starting backend or setting up listeners:', e)
                toast.error('启动后端服务时出错，请向作者反馈此问题')
            }
        }

        // Call the async function and handle cleanup
        let cleanupFunc = () => {} // Initialize cleanup function
        startAndListen().then((cleanup) => {
            if (cleanup) cleanupFunc = cleanup
        })

        return () => {
            if (!isModalOpen) {
                return
            }

            cleanupFunc()
        }
    }, [isModalOpen])
    return (
        <Dialog open={isModalOpen}>
            <DialogContent>
                <DialogTitle>正在启动后端程序</DialogTitle>
                <LogViewer height={400} width={450} isTextWrapped={true} data={logQueue} hasLineNumbers={false} />
            </DialogContent>
        </Dialog>
    )
}

export default StartBackendModal
