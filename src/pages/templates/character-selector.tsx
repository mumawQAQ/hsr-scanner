import Select from 'react-select'
import { CustomMultiValueLabelWithIcon, CustomOption, OptionSetWithIcon } from '@/components/ui/selecter.tsx'

type CharacterSelectionProps = {
    options: OptionSetWithIcon[]
    value: readonly OptionSetWithIcon[]
    onChange: (newValue: OptionSetWithIcon[]) => void
}

const CharacterSelector = ({ options, value, onChange }: CharacterSelectionProps) => {
    return (
        <Select
            isMulti
            closeMenuOnSelect={false}
            components={{
                Option: CustomOption,
                MultiValueLabel: CustomMultiValueLabelWithIcon,
            }}
            options={options}
            value={value}
            menuPlacement="top"
            onChange={(newValue) => onChange([...newValue])}
            placeholder="角色筛选"
        />
    )
}

export default CharacterSelector
