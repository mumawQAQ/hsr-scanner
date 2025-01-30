import React, { useEffect } from 'react'
import { listen } from '@tauri-apps/api/event'
import { useRelicBoxPosition, useUpdateRelicBoxPosition } from '@/apis/config'
import { RelicBoxPositionType } from '@/types/api-types'
import { invoke } from '@tauri-apps/api/core'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label.tsx'
import { Button } from '@/components/ui/button.tsx'

type BoxSettingProps = {
    name: RelicBoxPositionType
}

const BoxSetting = ({ name }: BoxSettingProps) => {
    const [isGenerating, setIsGenerating] = React.useState(false)
    const relicBoxPosition = useRelicBoxPosition(name)
    const updateRelicBoxPosition = useUpdateRelicBoxPosition()

    useEffect(() => {
        if (isGenerating) {
            // Start the backend and set up listeners
            const startAndListen = async () => {
                try {
                    // Listen for 'backend-log' events
                    const logUnlistener = await listen<string>('screen-annotator-log', (event) => {
                        const result = JSON.parse(event.payload)
                        if (result.status === 'success') {
                            const box = JSON.parse(result.data)
                            updateRelicBoxPosition.mutate({
                                type: name,
                                box: {
                                    x: box.x,
                                    y: box.y,
                                    w: box.w,
                                    h: box.h,
                                },
                            })
                        } else {
                            toast.error(result.message)
                        }
                    })

                    // Listen for 'backend-port' events
                    const exitUnlistener = await listen('screen-annotator-exit', () => {
                        console.log('screen-annotator-exit')
                        setIsGenerating(false)
                    })

                    await invoke('start_backend') // Start the backend process

                    // Return cleanup function to remove event listeners
                    return () => {
                        logUnlistener()
                        exitUnlistener()
                    }
                } catch (e) {
                    console.error('Error setting up listeners:', e)
                    toast.error('监听生成位置脚本失败')
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
        }
    }, [isGenerating])

    const handleGenerateBox = async () => {
        try {
            await invoke('start_screen_annotator', {
                displayOnly: false,
                x: [],
                y: [],
                w: [],
                h: [],
            })
            setIsGenerating(true)
        } catch (error) {
            console.error('Error calling generate position script:', error)
            toast.error('生成位置脚本调用失败')
        }
    }

    const handlePreviewBox = async () => {
        try {
            await invoke('start_screen_annotator', {
                displayOnly: true,
                x: [relicBoxPosition.data ? relicBoxPosition.data.value.x : 0],
                y: [relicBoxPosition.data ? relicBoxPosition.data.value.y : 0],
                w: [relicBoxPosition.data ? relicBoxPosition.data.value.w : 0],
                h: [relicBoxPosition.data ? relicBoxPosition.data.value.h : 0],
            })
        } catch (error) {
            console.error('Error calling generate position script:', error)
            toast.error('预览位置脚本调用失败')
        }
    }

    const handleStopGenerateBox = () => {
        setIsGenerating(false)
    }

    const handleBoxChange = (type: 'x' | 'y' | 'w' | 'h', val: string) => {
        const newValue = parseInt(val, 10) || 0

        const x = relicBoxPosition.data ? relicBoxPosition.data.value.x : 0
        const y = relicBoxPosition.data ? relicBoxPosition.data.value.y : 0
        const w = relicBoxPosition.data ? relicBoxPosition.data.value.w : 0
        const h = relicBoxPosition.data ? relicBoxPosition.data.value.h : 0

        if (type === 'x') {
            updateRelicBoxPosition.mutate({
                type: name,
                box: { x: newValue, y, w, h },
            })
        } else if (type === 'y') {
            updateRelicBoxPosition.mutate({
                type: name,
                box: { x, y: newValue, w, h },
            })
        } else if (type === 'w') {
            updateRelicBoxPosition.mutate({
                type: name,
                box: { x, y, w: newValue, h },
            })
        } else if (type === 'h') {
            updateRelicBoxPosition.mutate({
                type: name,
                box: { x, y, w, h: newValue },
            })
        }
    }

    return (
        <div className="flex flex-row items-center">
            <div className="grow">
                {name === 'relic_title' ? '遗器标题' : name === 'relic_main_stat' ? '遗器主属性' : '遗器副属性'}
            </div>

            <div className="ml-20 flex flex-row gap-2 items-center">
                <Label htmlFor="x">X</Label>
                <Input
                    id="x"
                    type="number"
                    min={0}
                    value={relicBoxPosition.data ? relicBoxPosition.data.value.x.toString() : '0'}
                    onChange={(e) => handleBoxChange('x', e.target.value)}
                    max={10000}
                />

                <Label htmlFor="y">Y</Label>
                <Input
                    id="y"
                    type="number"
                    value={relicBoxPosition.data ? relicBoxPosition.data.value.y.toString() : '0'}
                    onChange={(e) => handleBoxChange('y', e.target.value)}
                    min={0}
                    max={10000}
                />

                <Label htmlFor="w">W</Label>
                <Input
                    id="w"
                    type="number"
                    value={relicBoxPosition.data ? relicBoxPosition.data.value.w.toString() : '0'}
                    onChange={(e) => handleBoxChange('w', e.target.value)}
                    min={0}
                    max={10000}
                />

                <Label htmlFor="h">H</Label>
                <Input
                    id="h"
                    type="number"
                    value={relicBoxPosition.data ? relicBoxPosition.data.value.h.toString() : '0'}
                    onChange={(e) => handleBoxChange('h', e.target.value)}
                    min={0}
                    max={10000}
                />
                {isGenerating ? (
                    <Button onClick={handleStopGenerateBox}>停止监听</Button>
                ) : (
                    <Button onClick={handleGenerateBox}>生成位置</Button>
                )}

                <Button onClick={handlePreviewBox}>预览位置</Button>
            </div>
        </div>
    )
}

export default BoxSetting
