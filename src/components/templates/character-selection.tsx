import Spinner from '@/components/spinner.tsx'
import { useJsonFile } from '@/apis/files'
import Select, { ActionMeta, MultiValue } from 'react-select'
import { CustomMultiValueLabelWithIcon, CustomOption, OptionSetWithIcon } from '@/components/ui/selecter.tsx'
import { useMemo } from 'react'
import makeAnimated from 'react-select/animated'
import { RelicRule } from '@/types/relic-rule-type.ts'

const animatedComponents = makeAnimated()

export type CharacterSelectionProps = {
    relicRule: RelicRule
    onSelectionChange: (newValue: MultiValue<OptionSetWithIcon>, _: ActionMeta<OptionSetWithIcon>) => void
}

export default function CharacterSelection({ relicRule, onSelectionChange }: CharacterSelectionProps) {
    const { data: characters, error, isLoading } = useJsonFile('character/character_meta.json')

    const options: OptionSetWithIcon[] = useMemo(() => {
        if (!characters) {
            return []
        }
        return Object.keys(characters).map((relicSet) => ({
            value: relicSet,
            label: characters[relicSet].name,
            icon: characters[relicSet].icon,
        }))
    }, [characters])

    if (error || !characters) {
        console.error('Failed to fetch characters:', error)
        return null
    }

    if (isLoading) {
        return <Spinner />
    }

    return (
        <div className="space-y-2 w-full max-w-md">
            <label className="block text-center text-sm font-semibold text-gray-700">角色</label>
            <Select
                isMulti
                closeMenuOnSelect={false}
                components={{
                    ...animatedComponents,
                    Option: CustomOption,
                    MultiValueLabel: CustomMultiValueLabelWithIcon,
                }}
                options={options}
                value={relicRule.fit_characters
                    .map((c) => options.find((option) => option.value === c))
                    .filter((option): option is OptionSetWithIcon => !!option)}
                onChange={onSelectionChange}
                placeholder="选择角色"
                className="w-full"
            />
        </div>
    )
}
