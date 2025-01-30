import { RelicSubStatsType } from '@/types/relic-stat-types.ts'
import Select, { ActionMeta, MultiValue } from 'react-select'
import makeAnimated from 'react-select/animated'
import { useMemo } from 'react'
import { CustomMultiValueLabelWithNumber, OptionSetWithNumber } from '@/components/ui/selecter.tsx'
import { RelicRule } from '@/types/relic-rule-type.ts'

const animatedComponents = makeAnimated()

type RelicSubStatSelectionProps = {
    relicRule: RelicRule
    onSelectionChange: (newValue: MultiValue<OptionSetWithNumber>, _: ActionMeta<OptionSetWithNumber>) => void
    handleSubStatNumberChange: (optionToUpdate: OptionSetWithNumber, newValue: number) => void
}

export default function RelicSubStatSelection({
    relicRule,
    onSelectionChange,
    handleSubStatNumberChange,
}: RelicSubStatSelectionProps) {
    const options = useMemo(() => {
        return Object.keys(RelicSubStatsType).map((subStat) => ({
            value: subStat,
            label: RelicSubStatsType[subStat],
            number: 1,
        }))
    }, [RelicSubStatsType])

    const selectedRelicSubStats = useMemo(() => {
        if (relicRule.valuable_subs) {
            return relicRule.valuable_subs
                .map((subStat) => {
                    const foundOption = options.find((opt) => opt.value === subStat.name)
                    if (foundOption) {
                        return {
                            ...foundOption,
                            number: subStat.rating_scale,
                        }
                    }
                })
                .filter((option): option is OptionSetWithNumber => !!option)
        } else {
            return []
        }
    }, [relicRule, options])

    return (
        <div className="space-y-2 w-full max-w-md">
            <label className="block text-center text-sm font-semibold text-gray-700">副属性</label>
            <Select
                closeMenuOnSelect={false}
                components={{
                    ...animatedComponents,
                    MultiValueLabel: (props) => (
                        <CustomMultiValueLabelWithNumber {...props} onNumberChange={handleSubStatNumberChange} />
                    ),
                }}
                isMulti
                options={options}
                value={selectedRelicSubStats}
                onChange={onSelectionChange}
                backspaceRemovesValue={false}
                placeholder="选择副属性"
                className="w-full"
            />
        </div>
    )
}
