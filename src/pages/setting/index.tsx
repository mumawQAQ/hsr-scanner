// @ts-ignore
import sponsorImg from '/sponsor.jpg'
import { getVersion } from '@tauri-apps/api/app'
import { useEffect, useState } from 'react'
import { Bug, Flag, Github, RefreshCcw } from 'lucide-react'
import { check, Update } from '@tauri-apps/plugin-updater'
import { AssertUpdateCheckResponse } from '@/types/api-types'
import { relaunch } from '@tauri-apps/plugin-process'
import { useMousePosition } from '@/apis/state'
import {
    useAnalysisFailSkip,
    useAutoDetectDiscardIcon,
    useAutoDetectRelicBoxPosition,
    useDiscardIconPosition,
    useRelicDiscardScore,
    useUpdateAnalysisFailSkip,
    useUpdateAutoDetectDiscardIcon,
    useUpdateAutoDetectRelicBoxPosition,
    useUpdateDiscardIconPosition,
    useUpdateRelicDiscardScore,
} from '@/apis/config'
import { useJsonFile } from '@/apis/files'
import { toast } from 'sonner'
import { invoke } from '@tauri-apps/api/core'
import { Button } from '@/components/ui/button.tsx'
import { Switch } from '@/components/ui/switch.tsx'
import { Card, CardContent } from '@/components/ui/card.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { Input } from '@/components/ui/input'
import BoxSetting from './box-setting'

const Setting = () => {
    const [version, setVersion] = useState<string | null>(null)
    const [update, setUpdate] = useState<Update | undefined>(undefined)
    const [onCheckAppUpdate, setOnCheckAppUpdate] = useState<boolean>(false)
    const [onAppDownload, setOnAppDownload] = useState<boolean>(false)

    const [onAssertUpdate, setOnAssertUpdate] = useState<boolean>(false)
    const [filesToUpdate, setFilesToUpdate] = useState<string[]>([])
    const [errors, setErrors] = useState<string[]>([])

    const { data: assetsCheckSum } = useJsonFile('checksum.json')

    const mousePosition = useMousePosition()
    const autoDetectDiscardIcon = useAutoDetectDiscardIcon()
    const updateAutoDetectDiscardIcon = useUpdateAutoDetectDiscardIcon()
    const discardIconPosition = useDiscardIconPosition()
    const updateDiscardIconPosition = useUpdateDiscardIconPosition()
    const autoDetectRelicBoxPosition = useAutoDetectRelicBoxPosition()
    const updateAutoDetectRelicBoxPosition = useUpdateAutoDetectRelicBoxPosition()
    const relicDiscardScore = useRelicDiscardScore()
    const updateRelicDiscardScore = useUpdateRelicDiscardScore()
    const analysisFailSkip = useAnalysisFailSkip()
    const updateAnalysisFailSkip = useUpdateAnalysisFailSkip()

    useEffect(() => {
        getVersion().then((version) => {
            setVersion(version)
        })
    }, [])

    const handleCheckAppUpdate = async () => {
        setOnCheckAppUpdate(true)
        try {
            const update = await check()
            if (update?.available) {
                setUpdate(update)
            } else {
                toast.success('当前已是最新版本')
            }
        } catch (e) {
            console.error(e)
            toast.error(`检查更新时出现错误 ${e}`)
        }
        setOnCheckAppUpdate(false)
    }

    const handleAppDownload = async () => {
        setOnAppDownload(true)
        try {
            // kill the backend
            await invoke<string>('kill_background_process')
            // backup the database
            await invoke<string>('pre_backup')

            const update = await check()
            if (update?.available) {
                await update.downloadAndInstall()
                // requires the `process` plugin
                await relaunch()
            }
        } catch (e) {
            toast.error(`更新时出现错误 ${e}`)
        }
        setOnAppDownload(false)
    }

    const handleCheckAssetsUpdate = async (download: boolean) => {
        setOnAssertUpdate(true)
        setFilesToUpdate([])
        setErrors([])

        try {
            const response = await invoke<string>('check_asserts_update', { download: download })
            const assertUpdateCheckResponse: AssertUpdateCheckResponse = JSON.parse(response)

            if (assertUpdateCheckResponse.errors && assertUpdateCheckResponse.errors.length > 0) {
                setErrors(assertUpdateCheckResponse.errors)
            } else if (assertUpdateCheckResponse.update_needed) {
                setFilesToUpdate(assertUpdateCheckResponse.files || [])
            } else if (!download) {
                toast.success('资源已是最新版本')
            } else {
                toast.success('资源更新完成, 请重启软件以加载最新资源')
            }
        } catch (e) {
            toast.error(`获取资源时出现错误 ${e}`)
        }

        setOnAssertUpdate(false)
    }

    const handlePreviewMousePosition = () => {
        const mouseX = discardIconPosition.data ? discardIconPosition.data.value.x : 0
        const mouseY = discardIconPosition.data ? discardIconPosition.data.value.y : 0

        if (mouseX === 0 || mouseY === 0) {
            toast.error('请先填写鼠标位置')
            return
        }

        mousePosition.mutate(
            {
                mouse_x: mouseX,
                mouse_y: mouseY,
            },
            {
                onError: (e) => {
                    toast.error(`预览鼠标位置失败, 请重试, ${e.message}`)
                },
            }
        )
    }

    const handleChangeAutoDetectDiscardIcon = (isSelected: boolean) => {
        updateAutoDetectDiscardIcon.mutate(isSelected)
    }

    const handleChangeAutoDetectRelicBoxPosition = (isSelected: boolean) => {
        updateAutoDetectRelicBoxPosition.mutate(isSelected)
    }

    const handleChangeDiscardIconPosition = (type: string, val: string) => {
        const newValue = parseInt(val, 10) || 0
        const discardIconX = discardIconPosition.data ? discardIconPosition.data.value.x : 0
        const discardIconY = discardIconPosition.data ? discardIconPosition.data.value.y : 0

        if (type === 'x') {
            updateDiscardIconPosition.mutate({
                x: newValue,
                y: discardIconY,
            })
        } else if (type === 'y') {
            updateDiscardIconPosition.mutate({
                x: discardIconX,
                y: newValue,
            })
        }
    }

    const handleChangeRelicDiscardScore = (val: string) => {
        const newValue = parseInt(val, 10) || 0
        updateRelicDiscardScore.mutate(newValue)
    }

    const handleChangeAnalysisFailSkip = (isSelected: boolean) => {
        updateAnalysisFailSkip.mutate(isSelected)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="text-center text-gray-600">
                HSR Scanner是一个开源的崩坏：星穹铁道遗器扫描工具，用来帮助玩家更好的清理遗器。
            </div>
            <div className="flex justify-center items-center gap-4">
                <Button
                    variant="link"
                    onClick={async () => {
                        await open('https://github.com/mumawQAQ/hsr-scanner')
                    }}
                >
                    <Github />
                    GitHub
                </Button>

                <Button
                    variant="link"
                    onClick={async () => {
                        await open('https://github.com/mumawQAQ/hsr-scanner/issues')
                    }}
                >
                    <Bug />
                    提交Bug
                </Button>

                <Button
                    variant="link"
                    onClick={async () => {
                        await open('https://github.com/mumawQAQ/hsr-scanner/issues')
                    }}
                >
                    <Flag />
                    提交功能建议
                </Button>
            </div>

            <div className="text-medium font-semibold">自动扫描</div>
            <Card className="pt-5 px-2 shadow-xl rounded-lg">
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-row items-center">
                        <div className="grow flex flex-col gap-2">
                            <div>自动识别丢弃图标</div>
                            <div className="text-sm text-gray-500">
                                如果该选择开启则会使用yolo模型自动检测丢弃图标位置，如果检测失败可能导致无法自动标记，可以关闭此选项并手动设置图标位置
                            </div>
                        </div>

                        <div className="ml-20">
                            <Switch
                                checked={autoDetectDiscardIcon.data}
                                onCheckedChange={handleChangeAutoDetectDiscardIcon}
                            />
                        </div>
                    </div>

                    <Separator />
                    <div className="font-bold">手动设置丢弃图标位置</div>

                    <div className="flex flex-row items-center">
                        <div className="grow">丢弃图标x坐标</div>

                        <div className="ml-20">
                            <Input
                                type="number"
                                value={discardIconPosition.data ? discardIconPosition.data.value.x.toString() : '0'}
                                onChange={(e) => handleChangeDiscardIconPosition('x', e.target.value)}
                                min={0}
                                max={10000}
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="grow">丢弃图标y坐标</div>

                        <div className="ml-20">
                            <Input
                                type="number"
                                value={discardIconPosition.data ? discardIconPosition.data.value.y.toString() : '0'}
                                onChange={(e) => handleChangeDiscardIconPosition('y', e.target.value)}
                                min={0}
                                max={10000}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handlePreviewMousePosition}>预览位置</Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="pt-5 px-2 shadow-lg rounded-lg">
                <CardContent className="flex flex-row gap-2 items-center">
                    <div className="grow flex flex-col gap-2">
                        <div>丢弃分数</div>
                        <div className="text-sm text-gray-500">如果分数小于该值则会自动标记</div>
                    </div>

                    <div className="ml-20">
                        <Input
                            type="number"
                            value={relicDiscardScore.data ? relicDiscardScore.data.toString() : '0'}
                            onChange={(e) => {
                                handleChangeRelicDiscardScore(e.target.value)
                            }}
                            min={0}
                            max={100}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="pt-5 px-2 shadow-lg rounded-lg">
                <CardContent className="flex flex-row gap-2 items-center">
                    <div className="grow flex flex-col gap-2">
                        <div>出错跳过</div>
                        <div className="text-sm text-gray-500">
                            在识别过程中可能因为各种情况导致识别错误，如果开启此选项，则会跳过当前遗器的标记，继续进行下一个遗器的识别，
                            否则会重试直到成功
                        </div>
                    </div>

                    <div className="ml-20">
                        <Switch checked={analysisFailSkip.data} onCheckedChange={handleChangeAnalysisFailSkip} />
                    </div>
                </CardContent>
            </Card>

            <div className="text-medium font-semibold">识别区域</div>
            <Card className="pt-5 px-2 shadow-lg rounded-lg">
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-row items-center">
                        <div className="grow flex flex-col gap-2">
                            <div>自动识别遗器属性/名称位置</div>
                            <div className="text-sm text-gray-500">
                                如果该选择开启则会使用yolo模型自动检测遗器主属性，副属性，名称位置，如果检测失败可能导致ocr错误，可以关闭此选项并手动设置位置
                            </div>
                        </div>

                        <div className="ml-20">
                            <Switch
                                checked={autoDetectRelicBoxPosition.data}
                                onCheckedChange={handleChangeAutoDetectRelicBoxPosition}
                            />
                        </div>
                    </div>
                    <Separator />

                    <div>
                        <div className="font-bold">手动设置遗器名称位置</div>
                        <div className="text-sm text-gray-500">
                            在点击预览位置/生成位置之前请保证游戏打开，语言选择英语，并且在遗器背包界面
                        </div>
                    </div>

                    <BoxSetting name={'relic_title'} />
                    <BoxSetting name={'relic_main_stat'} />
                    <BoxSetting name={'relic_sub_stat'} />
                </CardContent>
            </Card>

            <div className="text-medium font-semibold">版本 & 更新</div>
            <Card className="pt-5 px-2 shadow-lg rounded-lg">
                <CardContent className="flex flex-row gap-2 items-center">
                    <RefreshCcw />
                    <div className="grow">当前版本：{version ?? '未知'}</div>

                    <Button onClick={handleCheckAppUpdate} disabled={onCheckAppUpdate}>
                        检查软件更新
                    </Button>
                </CardContent>
            </Card>

            {update && (
                <Card className="py-3 px-2 bg-green-400 shadow-lg radius-sm">
                    <CardContent className="flex flex-row items-center">
                        <div className="flex flex-col gap-2 grow">
                            <div className="text-medium font-semibold">发现新版本 {update.version}</div>
                            <div>{update.body}</div>
                        </div>
                        <Button variant="destructive" onClick={handleAppDownload} disabled={onAppDownload}>
                            {onAppDownload ? '更新中...' : '更新'}
                        </Button>
                    </CardContent>
                </Card>
            )}

            <Card className="pt-5 px-2 shadow-lg rounded-lg">
                <CardContent className="flex flex-row gap-2 items-center">
                    <RefreshCcw />
                    <div className="grow">当前游戏资源版本：{assetsCheckSum?.version ?? '未知版本'}</div>

                    <Button onClick={() => handleCheckAssetsUpdate(false)} disabled={onAssertUpdate}>
                        检查资源更新
                    </Button>
                </CardContent>
            </Card>

            {filesToUpdate.length > 0 && (
                <Card className="py-3 px-2 bg-green-400 shadow-lg radius-sm">
                    <CardContent className="flex flex-row items-center">
                        <div className="flex flex-col gap-2 grow">
                            <div className="text-medium font-semibold">发现新资源</div>
                            <div>
                                <ul>
                                    {filesToUpdate.map((file) => (
                                        <li key={file}>{file}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={() => handleCheckAssetsUpdate(true)}
                            disabled={onAppDownload}
                        >
                            {onAssertUpdate ? '更新中...' : '更新'}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {errors.length > 0 && (
                <Card className="py-3 px-2 bg-red-900 text-white shadow-lg radius-sm">
                    <CardContent className="flex flex-col gap-2">
                        <div className="text-medium font-semibold">获取资源时出现错误</div>
                        <div>
                            <ul>
                                {errors.map((error) => (
                                    <li key={error}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-center">
                <Card className="pt-4 px-2 shadow-lg rounded-xl w-[320px] h-[400px] relative bg-white">
                    <div className="relative w-full h-full flex flex-col items-center">
                        <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden">
                            <div className="w-full h-16 bg-[#4285f4] rounded-b-[100%]" />
                        </div>

                        <div className="relative z-10 mt-8 bg-white rounded-xl shadow-sm p-3">
                            <img
                                src={sponsorImg}
                                alt="sponsor QR code"
                                className="w-[220px] h-[220px] object-contain rounded-lg"
                            />
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-gray-700 font-medium text-lg mb-2">感谢支持开源项目</p>
                            <p className="text-gray-500 text-sm">打赏一杯咖啡</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Setting
