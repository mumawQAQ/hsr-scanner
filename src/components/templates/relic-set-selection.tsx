import { useJsonFile } from '@/apis/files'
import Spinner from '@/components/spinner.tsx'
import makeAnimated from 'react-select/animated'
import Select, { ActionMeta, MultiValue } from 'react-select'
import { CustomMultiValueLabelWithIcon, CustomOption, OptionSetWithIcon } from '@/components/ui/selecter.tsx'
import { useMemo } from 'react'
import { RelicRule } from '@/types/relic-rule-type.ts'

const animatedComponents = makeAnimated()

type RelicSetSelectionProps = {
    relicRule: RelicRule
    onSelectionChange: (newValue: MultiValue<OptionSetWithIcon>, _: ActionMeta<OptionSetWithIcon>) => void
}

export default function RelicSetSelection({ relicRule, onSelectionChange }: RelicSetSelectionProps) {
    const { data: relicSets, error, isLoading } = useJsonFile('relic/relic_sets.json')

    const options: OptionSetWithIcon[] = useMemo(() => {
        if (!relicSets) {
            return []
        }
        return Object.keys(relicSets).map((relicSet) => ({
            value: relicSet,
            label: relicSets[relicSet].name,
            icon: relicSets[relicSet].icon,
        }))
    }, [relicSets])

    if (error || !relicSets) {
        console.error('Failed to fetch relic sets:', error)
        return null
    }

    if (isLoading) {
        return <Spinner />
    }

    return (
        <div className="space-y-2 w-full max-w-md">
            <label className="block text-sm text-center font-semibold text-gray-700">遗器</label>
            <Select
                closeMenuOnSelect={false}
                components={{
                    ...animatedComponents,
                    Option: CustomOption,
                    MultiValueLabel: CustomMultiValueLabelWithIcon,
                }}
                isMulti
                options={options}
                value={relicRule.set_names
                    .map((set) => options.find((opt) => opt.value === set))
                    .filter((option): option is OptionSetWithIcon => !!option)}
                onChange={onSelectionChange}
                placeholder="选择套装"
                className="w-full"
            />
        </div>
    )
}
