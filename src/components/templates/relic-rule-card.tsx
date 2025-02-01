import { useJsonFile } from '@/apis/files'
import { useDeleteRelicRule, useRelicRule, useUpdateRelicRule } from '@/apis/relic-template'
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card.tsx'
import CharacterSelection from '@/components/templates/character-selection.tsx'
import RelicSetSelection from '@/components/templates/relic-set-selection.tsx'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon, ChevronUpIcon, X } from 'lucide-react'
import RelicSubStatSelection from '@/components/templates/relic-sub-stat-selection.tsx'
import RelicMainStatSelection from '@/components/templates/relic-main-stat-selection.tsx'
import { ActionMeta, MultiValue } from 'react-select'
import { OptionSet, OptionSetWithIcon, OptionSetWithNumber } from '@/components/ui/selecter'
import { RelicMainStatsType } from '@/types/relic-stat-types.ts'

type RelicRuleCardProps = {
    templateId: string
    ruleId: string
    isInUse: boolean
}

function RelicRuleCard({ ruleId, templateId, isInUse }: RelicRuleCardProps) {
    const relicRule = useRelicRule(ruleId)
    const updateRelicRule = useUpdateRelicRule()
    const relicSets = useJsonFile('relic/relic_sets.json')
    const deleteRelicRule = useDeleteRelicRule()
    const [showOuter, setShowOuter] = useState(false)
    const [showInner, setShowInner] = useState(false)
    const [hiddenDetails, setHiddenDetails] = useState(true)

    const handleShowInner = (setNames: string[]) => {
        if (setNames.length === 0) {
            setShowInner(false)
            return false
        }

        const haveInner = setNames.some((setName) => {
            const innerSet = relicSets.data[setName]?.isInner
            return innerSet === true
        })

        setShowInner(haveInner)
        return haveInner
    }

    const handleShowOuter = (setNames: string[]) => {
        if (setNames.length === 0) {
            setShowOuter(false)
            return false
        }

        const haveOuter = setNames.some((setName) => {
            const innerSet = relicSets.data[setName]?.isInner
            return innerSet === false
        })

        setShowOuter(haveOuter)
        return haveOuter
    }

    useEffect(() => {
        if (relicRule.data) {
            handleShowInner(relicRule.data.set_names)
            handleShowOuter(relicRule.data.set_names)
        }
    }, [relicRule.data])

    if (relicRule.error || !relicRule.data || relicSets.error || !relicSets.data) {
        return (
            <Card className="min-h-[15rem] w-[22rem] relative">
                <CardContent className="flex items-center justify-center text-center">
                    Error: {relicRule.error?.message || relicSets.error?.message || '无法加载遗物规则数据！'}
                </CardContent>
            </Card>
        )
    }

    if (relicRule.isLoading || relicSets.isLoading) {
        return (
            <Card className="min-h-[15rem] w-[22rem] relative">
                <CardContent className="flex items-center justify-center text-center">加载中...</CardContent>
            </Card>
        )
    }

    const handleDelete = () => {
        deleteRelicRule.mutate({
            template_id: templateId,
            rule_id: ruleId,
        })
    }

    const handleSelectedCharacterChange = (
        newValue: MultiValue<OptionSetWithIcon>,
        _: ActionMeta<OptionSetWithIcon>
    ) => {
        if (!relicRule || !relicRule.data) {
            return
        }
        updateRelicRule.mutate({
            ...relicRule.data,
            fit_characters: newValue.map((character) => character.value),
        })
    }

    const handleSelectedRelicSetChange = (
        newValue: MultiValue<OptionSetWithIcon>,
        _: ActionMeta<OptionSetWithIcon>
    ) => {
        if (!relicRule || !relicRule.data) {
            return
        }

        updateRelicRule.mutate({
            ...relicRule.data,
            set_names: newValue.map((set) => set.value),
        })
    }

    const handleSelectedMainStatChange = (
        mainStatType: RelicMainStatsType,
        newValue: MultiValue<OptionSet>,
        _: ActionMeta<OptionSet>
    ) => {
        if (!relicRule || !relicRule.data) {
            return
        }

        updateRelicRule.mutate({
            ...relicRule.data,
            valuable_mains: {
                ...relicRule.data.valuable_mains,
                [mainStatType]: newValue.map((stat) => stat.value),
            },
        })
    }

    const handleSelectedSubStatChange = (
        newValue: MultiValue<OptionSetWithNumber>,
        _: ActionMeta<OptionSetWithNumber>
    ) => {
        if (!relicRule || !relicRule.data) {
            return
        }

        updateRelicRule.mutate({
            ...relicRule.data,
            valuable_subs: newValue.map((stat) => ({
                name: stat.value,
                rating_scale: stat.number,
            })),
        })
    }

    const handleSubStatNumberChange = (optionToUpdate: OptionSetWithNumber, newValue: number) => {
        if (!relicRule || !relicRule.data) {
            return
        }

        updateRelicRule.mutate({
            ...relicRule.data,
            valuable_subs: relicRule.data.valuable_subs.map((stat) => {
                return stat.name === optionToUpdate.value ? { ...stat, rating_scale: newValue } : stat
            }),
        })
    }

    console.log('rendered')

    return (
        <Card className="px-4 py-6 bg-white shadow-md rounded-lg relative">
            <X
                className={`absolute top-2 right-2 cursor-pointer ${isInUse ? 'cursor-not-allowed opacity-50' : ''}`}
                onClick={handleDelete}
            />

            <CardContent className={`flex flex-col gap-3 ${isInUse ? 'opacity-50 pointer-events-none' : ''}`}>
                <CharacterSelection relicRule={relicRule.data} onSelectionChange={handleSelectedCharacterChange} />
                <RelicSetSelection relicRule={relicRule.data} onSelectionChange={handleSelectedRelicSetChange} />

                {!hiddenDetails || isInUse ? (
                    <>
                        {showOuter && (
                            <RelicMainStatSelection
                                type="head"
                                relicRule={relicRule.data}
                                onSelectionChange={handleSelectedMainStatChange}
                            />
                        )}

                        {showOuter && (
                            <RelicMainStatSelection
                                type="hand"
                                relicRule={relicRule.data}
                                onSelectionChange={handleSelectedMainStatChange}
                            />
                        )}

                        {showOuter && (
                            <RelicMainStatSelection
                                type="body"
                                relicRule={relicRule.data}
                                onSelectionChange={handleSelectedMainStatChange}
                            />
                        )}

                        {showOuter && (
                            <RelicMainStatSelection
                                type="feet"
                                relicRule={relicRule.data}
                                onSelectionChange={handleSelectedMainStatChange}
                            />
                        )}

                        {showInner && (
                            <RelicMainStatSelection
                                type="rope"
                                relicRule={relicRule.data}
                                onSelectionChange={handleSelectedMainStatChange}
                            />
                        )}

                        {showInner && (
                            <RelicMainStatSelection
                                type="sphere"
                                relicRule={relicRule.data}
                                onSelectionChange={handleSelectedMainStatChange}
                            />
                        )}

                        {(showInner || showOuter) && (
                            <>
                                <RelicSubStatSelection
                                    relicRule={relicRule.data}
                                    onSelectionChange={handleSelectedSubStatChange}
                                    handleSubStatNumberChange={handleSubStatNumberChange}
                                />
                                <div className="justify-center flex">
                                    <Button onClick={() => setHiddenDetails(true)}>
                                        <ChevronUpIcon />
                                        隐藏详情
                                    </Button>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    (showInner || showOuter) && (
                        <div className="justify-center flex">
                            <Button onClick={() => setHiddenDetails(false)}>
                                <ChevronDownIcon />
                                显示详情
                            </Button>
                        </div>
                    )
                )}
            </CardContent>

            {isInUse && (
                <div className="absolute inset-0 bg-white bg-opacity-0 flex items-center justify-center z-10 rounded-lg">
                    <div className="absolute bottom-2 font-black">模板正在使用中，无法编辑</div>
                </div>
            )}
        </Card>
    )
}

export default React.memo(RelicRuleCard, (prevProps, nextProps) => {
    return prevProps.templateId === nextProps.templateId && prevProps.ruleId === nextProps.ruleId
})
