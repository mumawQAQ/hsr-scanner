import { useCreateRelicRule, useExportTemplate, useRelicRuleList, useRelicTemplateList } from '@/apis/relic-template'
import Spinner from '@/components/spinner.tsx'
import { useEffect, useMemo, useRef, useState } from 'react'
import RelicTemplateCard from '@/components/templates/relic-template-card.tsx'
import RelicRuleCard from '@/components/templates/relic-rule-card.tsx'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { Button } from '@/components/ui/button.tsx'
import { FileUp, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useModal } from '@/hooks/use-modal.ts'
import { useJsonFile } from '@/apis/files'
import { OptionSet } from '@/components/ui/selecter.tsx'
import PathSelector from '@/components/path-selecter.tsx'

const Templates = () => {
    const [viewTemplateInUse, setViewTemplateInUse] = useState(false)
    const [viewTemplateId, setViewTemplateId] = useState<string>('')
    const [selectedCharacterPath, setSelectedCharacterPath] = useState<readonly OptionSet[]>([])
    const viewTemplateRef = useRef<HTMLDivElement>(null)

    const { onOpen } = useModal()
    const characters = useJsonFile('character/character_meta.json')
    const relicTemplateList = useRelicTemplateList()
    const relicRuleList = useRelicRuleList(viewTemplateId)
    const createRelicRule = useCreateRelicRule()
    const exportTemplate = useExportTemplate()

    useEffect(() => {
        if (relicTemplateList.data) {
            setViewTemplateInUse(
                relicTemplateList.data?.some((template) => template.id === viewTemplateId && template.in_use) || false
            )
            setSelectedCharacterPath([])
        }
    }, [relicTemplateList.data, viewTemplateId])

    const { characterPathOptions, characterPathToCharacters } = useMemo(() => {
        const mapper: Record<string, string[]> = {}
        const pathOptions: OptionSet[] = []
        if (characters.data) {
            Object.keys(characters.data).forEach((c) => {
                const character = characters.data[c]
                if (!mapper[character.paths]) {
                    mapper[character.paths] = []
                    pathOptions.push({ value: character.paths, label: character.paths })
                }
                mapper[character.paths].push(c)
            })
        }
        return {
            characterPathOptions: pathOptions,
            characterPathToCharacters: mapper,
        }
    }, [characters.data])

    const createNewRelicRule = () => {
        if (!viewTemplateId) {
            return
        }
        createRelicRule.mutate({
            template_id: viewTemplateId,
        })
        handleScrollToBottom()
    }

    const handleScrollToBottom = () => {
        if (viewTemplateRef.current) {
            window.scrollTo({
                top: viewTemplateRef.current.scrollHeight,
                behavior: 'instant',
            })
        }
    }

    const handleExportTemplate = () => {
        if (!viewTemplateId) {
            return
        }

        exportTemplate.mutate(viewTemplateId, {
            onSuccess: (data) => {
                if (!data) {
                    toast.error('导出失败, 请重试')
                    return
                }
                onOpen('export-template', { qrCodeData: data })
            },
        })
    }

    if (relicTemplateList.isLoading || characters.isLoading) {
        return (
            <div className="flex justify-center items-center flex-col mt-20 gap-4">
                <Spinner />
                <div className="font-black">加载中</div>
            </div>
        )
    }

    if (relicTemplateList.error || characters.error) {
        return (
            <div className="flex justify-center items-center flex-col mt-20 gap-4">
                <div className="font-black">加载失败</div>
            </div>
        )
    }

    return (
        <div ref={viewTemplateRef}>
            {viewTemplateId ? (
                <div className="relative">
                    <ResponsiveMasonry
                        columnsCountBreakPoints={{
                            350: 1,
                            750: 2,
                            900: 3,
                            1200: 4,
                            1500: 5,
                        }}
                        className="mt-2"
                    >
                        <Masonry>
                            {relicRuleList.data
                                ?.filter((relicRule) => {
                                    if (selectedCharacterPath.length === 0) {
                                        return true
                                    }
                                    const showingCharacters = selectedCharacterPath
                                        .map((s) => {
                                            return characterPathToCharacters[s.value]
                                        })
                                        .flat()

                                    return relicRule.fit_characters.some((c) => showingCharacters.includes(c))
                                })
                                .map((relicRule) => (
                                    <RelicRuleCard
                                        key={relicRule.id}
                                        templateId={viewTemplateId}
                                        ruleId={relicRule.id}
                                        isInUse={viewTemplateInUse}
                                    />
                                ))}
                        </Masonry>
                    </ResponsiveMasonry>

                    <div className="fixed bottom-[1rem] right-4 z-40 flex gap-2 flex-col items-end">
                        <PathSelector
                            options={characterPathOptions}
                            value={selectedCharacterPath}
                            onChange={setSelectedCharacterPath}
                        />
                        <Button onClick={handleExportTemplate} className="w-fit">
                            <FileUp />
                            导出
                        </Button>
                        {!viewTemplateInUse && (
                            <Button onClick={createNewRelicRule}>
                                <Plus />
                                创建规则
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap gap-4 mt-2 mx-2">
                    {relicTemplateList.data?.map((relicTemplate) => (
                        <div key={relicTemplate.id}>
                            <RelicTemplateCard template={relicTemplate} setViewTemplateId={setViewTemplateId} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Templates
