import { Button } from '@/components/ui/button.tsx'
import SwitchWithLabel from '@/components/switch-with-label.tsx'
import React, { useEffect, useMemo, useState } from 'react'
import { PipelineType, useBackend } from '@/hooks/use-backend.ts'
import { io, Socket } from 'socket.io-client'
import useRelic from '@/hooks/use-relic.ts'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import {
    useAnalysisFailSkip,
    useAutoDetectDiscardIcon,
    useAutoDetectRelicBoxPosition,
    useDiscardIconPosition,
    useRelicBoxPosition,
    useRelicDiscardScore,
} from '@/apis/config'
import { useModal } from '@/hooks/use-modal.ts'
import ImageDisplay from '@/components/image-display.tsx'
import { useJsonFile } from '@/apis/files'
import axios from 'axios'
import { getBackendUrl } from '@/lib/utils.ts'
import { useRelicTemplateList } from '@/apis/relic-template'
import { invoke } from '@tauri-apps/api/core'
import { useCheckAssetUpdate } from '@/hooks/use-check-asset-update.ts'
import { useCheckAppUpdate } from '@/hooks/use-check-app-update.ts'

const SCORE_THRESHOLDS = {
    VERY_LOW: 20,
    LOW: 40,
    MEDIUM: 60,
    HIGH: 80,
}

const SCORE_CONFIG = {
    potential: {
        [SCORE_THRESHOLDS.VERY_LOW]: { text: '建议分解', color: 'bg-black' },
        [SCORE_THRESHOLDS.LOW]: { text: '不推荐强化', color: 'bg-gray-500' },
        [SCORE_THRESHOLDS.MEDIUM]: { text: '可以强化', color: 'bg-green-500' },
        [SCORE_THRESHOLDS.HIGH]: { text: '推荐强化', color: 'bg-yellow-500' },
        max: { text: '必须强化', color: 'bg-red-500' },
    },
    actual: {
        [SCORE_THRESHOLDS.VERY_LOW]: { text: 'C', color: 'bg-black' },
        [SCORE_THRESHOLDS.LOW]: { text: 'B', color: 'bg-gray-500' },
        [SCORE_THRESHOLDS.MEDIUM]: { text: 'A', color: 'bg-green-500' },
        [SCORE_THRESHOLDS.HIGH]: { text: 'S', color: 'bg-yellow-500' },
        max: { text: 'ACE', color: 'bg-red-500' },
    },
}

const Home = () => {
    const [socketIoClient, setSocketIoClient] = useState<Socket | null>(null)
    const [windowOnTop, setWindowOnTop] = useState(false)
    const [minimized, setMinimized] = useState(false)

    const backendStore = useBackend()
    const relicStore = useRelic()
    const modelStore = useModal()
    const relicTemplateList = useRelicTemplateList()
    const relicSets = useJsonFile('relic/relic_sets.json')
    const characters = useJsonFile('character/character_meta.json')
    const discardIconPosition = useDiscardIconPosition()
    const analysisFailSkip = useAnalysisFailSkip()
    const relicDiscardScore = useRelicDiscardScore()
    const autoDetectDiscardIcon = useAutoDetectDiscardIcon()
    const autoDetectRelicBoxPosition = useAutoDetectRelicBoxPosition()
    const relicTitleBoxPosition = useRelicBoxPosition('relic_title')
    const relicMainStatBoxPosition = useRelicBoxPosition('relic_main_stat')
    const relicSubStatBoxPosition = useRelicBoxPosition('relic_sub_stat')

    useCheckAssetUpdate()
    useCheckAppUpdate()

    useEffect(() => {
        if (!backendStore.backendPort) {
            return
        }

        relicSets.refetch()
        characters.refetch()
        relicTemplateList.refetch()
        // init the used template for once
        axios.get(`${getBackendUrl(backendStore.backendPort)}/rating-template/init`)

        const socketClient = io(`http://localhost:${backendStore.backendPort}`)

        socketClient.on('pipeline_result', (data) => {
            if (data.stage === 'ocr_stage') {
                const relicData = data.data
                console.log(relicData)
                relicStore.setRelicInfo(relicData)
            } else if (data.stage === 'relic_analysis_stage') {
                const relicScores = data.data
                console.log(relicScores)
                relicStore.setRelicScores(relicScores)
            }
        })

        socketClient.on('pipeline_error', (data) => {
            toast.error(data.error)
        })

        socketClient.on('pipeline_started', (data) => {
            backendStore.setPipelineId(data.pipeline_id)
            if (data.pipeline_type === 'SingleRelicAnalysisPipeline') {
                backendStore.setPipelineType('SingleRelicAnalysisPipeline')
            } else if (data.pipeline_type === 'AutoRelicAnalysisPipeline') {
                backendStore.setPipelineType('AutoRelicAnalysisPipeline')
            }
        })

        socketClient.on('pipeline_stopped', (_) => {
            backendStore.setPipelineId()
            backendStore.setPipelineType()
        })

        setSocketIoClient(socketClient)
    }, [backendStore.backendPort])

    const ScoreChip = React.memo(({ score, type }: { score: number; type: 'potential' | 'actual' }) => {
        const scorePercentage = score * 100
        const config = SCORE_CONFIG[type]

        const { text, color } = useMemo(() => {
            if (scorePercentage < SCORE_THRESHOLDS.VERY_LOW) return config[SCORE_THRESHOLDS.VERY_LOW]
            if (scorePercentage < SCORE_THRESHOLDS.LOW) return config[SCORE_THRESHOLDS.LOW]
            if (scorePercentage < SCORE_THRESHOLDS.MEDIUM) return config[SCORE_THRESHOLDS.MEDIUM]
            if (scorePercentage < SCORE_THRESHOLDS.HIGH) return config[SCORE_THRESHOLDS.HIGH]
            return config.max
        }, [scorePercentage, config])

        return (
            <Badge className={color}>
                <span className="flex gap-2 items-center">
                    <span className="font-black">{text}</span>
                    <span className="font-black">{scorePercentage.toFixed(2)}</span>
                </span>
            </Badge>
        )
    })

    ScoreChip.displayName = 'ScoreChip'

    const CharacterIcons = React.memo(
        ({
            characters,
            characterMeta,
        }: {
            characters: string[]
            characterMeta: Record<string, { name: string; icon: string }>
        }) => (
            <>
                {characters.map((character, index) => (
                    <div key={index}>
                        <ImageDisplay
                            filePath={characterMeta[character].icon}
                            width={25}
                            height={25}
                            className="rounded-lg"
                        />
                    </div>
                ))}
            </>
        )
    )

    CharacterIcons.displayName = 'CharacterIcons'

    const handleStartPipeline = (type: PipelineType) => {
        if (socketIoClient === null) {
            toast.error('socket-io服务未启动, 请稍后再试')
            return
        }

        const relicTitleBox = {
            x: relicTitleBoxPosition.data ? relicTitleBoxPosition.data.value.x : 0,
            y: relicTitleBoxPosition.data ? relicTitleBoxPosition.data.value.y : 0,
            w: relicTitleBoxPosition.data ? relicTitleBoxPosition.data.value.w : 0,
            h: relicTitleBoxPosition.data ? relicTitleBoxPosition.data.value.h : 0,
        }

        const relicMainStatBox = {
            x: relicMainStatBoxPosition.data ? relicMainStatBoxPosition.data.value.x : 0,
            y: relicMainStatBoxPosition.data ? relicMainStatBoxPosition.data.value.y : 0,
            w: relicMainStatBoxPosition.data ? relicMainStatBoxPosition.data.value.w : 0,
            h: relicMainStatBoxPosition.data ? relicMainStatBoxPosition.data.value.h : 0,
        }

        const relicSubStatBox = {
            x: relicSubStatBoxPosition.data ? relicSubStatBoxPosition.data.value.x : 0,
            y: relicSubStatBoxPosition.data ? relicSubStatBoxPosition.data.value.y : 0,
            w: relicSubStatBoxPosition.data ? relicSubStatBoxPosition.data.value.w : 0,
            h: relicSubStatBoxPosition.data ? relicSubStatBoxPosition.data.value.h : 0,
        }

        if (type === 'SingleRelicAnalysisPipeline') {
            socketIoClient.emit('start_pipeline', {
                config_name: type,
                meta_data: {
                    auto_detect_relic_box_position: autoDetectRelicBoxPosition.data ?? true,
                    relic_title_box: relicTitleBox,
                    relic_main_stat_box: relicMainStatBox,
                    relic_sub_stat_box: relicSubStatBox,
                },
            })
        } else if (type === 'AutoRelicAnalysisPipeline') {
            socketIoClient.emit('start_pipeline', {
                config_name: type,
                meta_data: {
                    analysis_fail_skip: analysisFailSkip.data ?? true,
                    relic_discard_score: relicDiscardScore.data ?? 40,

                    auto_detect_discard_icon: autoDetectDiscardIcon.data ?? true,
                    discard_icon_x: discardIconPosition.data ? discardIconPosition.data.value.x : 0,
                    discard_icon_y: discardIconPosition.data ? discardIconPosition.data.value.y : 0,

                    auto_detect_relic_box_position: autoDetectRelicBoxPosition.data ?? true,
                    relic_title_box: relicTitleBox,
                    relic_main_stat_box: relicMainStatBox,
                    relic_sub_stat_box: relicSubStatBox,
                },
            })
        }
    }

    const handleStopPipeline = () => {
        if (socketIoClient === null) {
            toast.error('socket-io服务未启动, 请稍后再试')
            return
        }

        socketIoClient.emit('stop_pipeline', {})
    }

    const handleSelectTemplate = () => {
        modelStore.onOpen('select-template')
    }

    const handleWindowOnTopChange = async (checked: boolean) => {
        await invoke('set_window_on_top', { onTop: checked })
        setWindowOnTop(checked)
    }

    const handleMinimizeChange = async (checked: boolean) => {
        if (checked) {
            await invoke('set_window_size', { width: 600, height: 350 })
        } else {
            await invoke('set_window_size', { width: 800, height: 600 })
        }
        setMinimized(checked)
    }

    return (
        <div className="flex flex-col">
            <div className="flex my-10 mx-4 justify-around gap-2 ">
                <div className="flex gap-4 flex-col">
                    <SwitchWithLabel
                        id="top"
                        text="窗口置顶"
                        checked={windowOnTop}
                        onCheckedChange={handleWindowOnTopChange}
                    />
                    <SwitchWithLabel
                        id="small"
                        text="小屏模式"
                        checked={minimized}
                        onCheckedChange={handleMinimizeChange}
                    />
                    <SwitchWithLabel
                        id="manual"
                        text="手动扫描"
                        disabled={
                            socketIoClient === null ||
                            (backendStore.pipelineType !== 'SingleRelicAnalysisPipeline' &&
                                backendStore.pipelineType !== undefined)
                        }
                        onCheckedChange={(checked) => {
                            if (checked) {
                                handleStartPipeline('SingleRelicAnalysisPipeline')
                            } else {
                                handleStopPipeline()
                            }
                        }}
                    />
                    <SwitchWithLabel
                        id="auto"
                        text="自动扫描"
                        disabled={
                            socketIoClient === null ||
                            (backendStore.pipelineType !== 'AutoRelicAnalysisPipeline' &&
                                backendStore.pipelineType !== undefined)
                        }
                        onCheckedChange={(checked) => {
                            if (checked) {
                                handleStartPipeline('AutoRelicAnalysisPipeline')
                            } else {
                                handleStopPipeline()
                            }
                        }}
                    />
                    {!minimized && (
                        <>
                            <Button onClick={handleSelectTemplate}>选择模板</Button>
                        </>
                    )}
                </div>
                {backendStore.pipelineId ? (
                    <div className="flex flex-col gap-2">
                        <div className="font-black text-indigo-700 text-center">
                            {relicStore.relicInfo?.relic_title?.title}
                        </div>

                        <div className="flex items-center justify-center gap-2 font-semibold">
                            {relicStore.relicInfo?.relic_main_stat ? (
                                <>
                                    {relicStore.relicInfo?.relic_main_stat?.name}:{' '}
                                    {relicStore.relicInfo?.relic_main_stat?.number}
                                    <Badge>{relicStore.relicInfo?.relic_main_stat?.level}级</Badge>
                                </>
                            ) : (
                                <div className="text-red-600">未检测到主属性</div>
                            )}
                        </div>

                        <Separator />

                        <div className="flex flex-col gap-2">
                            {relicStore.relicInfo?.relic_sub_stat?.map((subStat) => (
                                <div
                                    key={subStat.name}
                                    className="flex items-center justify-center gap-2 font-semibold"
                                >
                                    {subStat.name}: {subStat.number}
                                    <Badge>
                                        {subStat.score.length > 1 ? subStat.score.join(' | ') : subStat.score[0]}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="font-semibold">选择模板后,开始扫描，显示遗器扫描内容</div>
                )}
                {/*TODO: rewrite this part*/}
                {backendStore.pipelineId && relicStore.relicScores?.length === 0 && (
                    <div className="font-semibold text-center">当前遗器无适用角色, 基于当前模板可以遗弃</div>
                )}
                {backendStore.pipelineId && relicStore.relicScores && relicStore.relicScores?.length > 0 && (
                    <div className="flex flex-col gap-2 max-h-[280px] overflow-y-scroll pr-10">
                        {relicStore?.relicScores?.map((score, index) => (
                            <div key={index} className="flex items-center justify-center gap-2 font-semibold">
                                <CharacterIcons characters={score.characters} characterMeta={characters.data} />
                                <ScoreChip
                                    score={score.score}
                                    type={score.type === 'potential' ? 'potential' : 'actual'}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home
