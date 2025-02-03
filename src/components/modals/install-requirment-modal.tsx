'use client'
import { LogViewer } from '@patternfly/react-log-viewer'
import { useEffect, useRef, useState } from 'react'
import { listen } from '@tauri-apps/api/event'
import { useModal } from '@/hooks/use-modal.ts'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog.tsx'
import { invoke } from '@tauri-apps/api/core'
import { toast } from 'sonner'
import { useBackend } from '@/hooks/use-backend.ts'

const InstallRequirementModal = () => {
    const [logQueue, setLogQueue] = useState<string[]>([])
    const [title, setTitle] = useState('正在安装必要依赖....')
    const logViewerRef = useRef()
    const backendStore = useBackend()
    const { isOpen, type } = useModal()

    const isModalOpen = isOpen && type === 'install-requirement'

    useEffect(() => {
        if (!isModalOpen) {
            return
        }
        const startAndListen = async () => {
            try {
                const successUnlistener = await listen<string>('requirements-status-success', () => {
                    toast.success('必要依赖安装成功')
                    backendStore.setAppState('requirement-ready')
                })
                const failureUnlistener = await listen<string>('requirements-status-failure', () => {
                    toast.error('必要依赖安装失败')
                })

                const statusUnlistener = await listen<string>('requirements-status-log', (event) => {
                    setLogQueue((prevState) => [...prevState, event.payload])
                })

                // Listen for 'backend-log' events
                const logUnlistener = await listen<string>('requirements-install-log', (event) => {
                    if (event.payload.startsWith('Frontend-Progress Log:')) {
                        setTitle(event.payload.replace('Frontend-Progress Log:', ''))
                    }
                    setLogQueue((prevState) => [...prevState, event.payload])
                })

                // Listen for 'backend-error' events
                const errorUnlistener = await listen<string>('requirements-install-error', (event) => {
                    setLogQueue((prevState) => [...prevState, event.payload])
                })

                await invoke('install_python_requirements') // start install script

                // Return cleanup function to remove event listeners
                return () => {
                    successUnlistener()
                    failureUnlistener()
                    statusUnlistener()
                    logUnlistener()
                    errorUnlistener()
                }
            } catch (e) {
                console.error('Error install requirement:', e)
            }
        }

        // Call the async function and handle cleanup
        let cleanupFunc = () => {} // Initialize cleanup function
        startAndListen().then((cleanup) => {
            if (cleanup) cleanupFunc = cleanup
        })

        // Cleanup listeners when component unmounts
        return () => {
            cleanupFunc()
        }
    }, [isModalOpen])

    useEffect(() => {
        if (logViewerRef.current) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            logViewerRef.current.scrollToBottom()
        }
    }, [logViewerRef.current, logQueue])

    return (
        <Dialog open={isModalOpen}>
            <DialogContent>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>根据你的网络情况，可能需要5-30分钟</DialogDescription>
                <LogViewer
                    height={400}
                    width={450}
                    isTextWrapped={true}
                    data={logQueue}
                    hasLineNumbers={false}
                    ref={logViewerRef}
                />
            </DialogContent>
        </Dialog>
    )
}

export default InstallRequirementModal
