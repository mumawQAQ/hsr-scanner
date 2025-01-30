import {
    RelicBodyMainStatsType,
    RelicFeetMainStatsType,
    RelicHandMainStatsType,
    RelicHeadMainStatsType,
    RelicMainStatsType,
    RelicRopeMainStatsType,
    RelicSphereMainStatsType,
} from '@/types/relic-stat-types'
import { useMemo } from 'react'
import { OptionSet } from '@/components/ui/selecter.tsx'
import makeAnimated from 'react-select/animated'
import Select, { ActionMeta, MultiValue } from 'react-select'
import { RelicRule } from '@/types/relic-rule-type.ts'

const translatedType = {
    head: '头部',
    hand: '手部',
    body: '身体',
    feet: '脚部',
    rope: '绳',
    sphere: '球',
}

const getSelectionItems = (type: RelicMainStatsType) => {
    switch (type) {
        case 'head':
            return RelicHeadMainStatsType
        case 'hand':
            return RelicHandMainStatsType
        case 'body':
            return RelicBodyMainStatsType
        case 'feet':
            return RelicFeetMainStatsType
        case 'rope':
            return RelicRopeMainStatsType
        case 'sphere':
            return RelicSphereMainStatsType
    }
}

const animatedComponents = makeAnimated()

export type RelicMainStatSelectionProps = {
    type: RelicMainStatsType
    relicRule: RelicRule
    onSelectionChange: (
        mainStatType: RelicMainStatsType,
        newValue: MultiValue<OptionSet>,
        _: ActionMeta<OptionSet>
    ) => void
}

export default function RelicMainStatSelection({ type, relicRule, onSelectionChange }: RelicMainStatSelectionProps) {
    const options = useMemo(() => {
        const selectionItems = getSelectionItems(type)
        return Object.keys(selectionItems).map((key) => ({
            label: selectionItems[key],
            value: key,
        }))
    }, [type])

    const currentTypeValue = useMemo(() => {
        if (relicRule.valuable_mains.hasOwnProperty(type)) {
            return relicRule.valuable_mains[type]
                .map((t) => options.find((opt) => opt.value === t))
                .filter((option): option is OptionSet => !!option)
        } else {
            return []
        }
    }, [relicRule, type, options])

    return (
        <div className="space-y-2 w-full max-w-md">
            <label className="block text-center text-sm font-semibold text-gray-700">{translatedType[type]}</label>
            <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={options}
                value={currentTypeValue}
                onChange={(newValue, actionMeta) => onSelectionChange(type, newValue, actionMeta)}
                placeholder={translatedType[type]}
                className="w-full"
            />
        </div>
    )
}
