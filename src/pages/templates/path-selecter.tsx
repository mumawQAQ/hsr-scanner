import React from 'react'
import Select from 'react-select'
import { OptionSet } from '@/components/ui/selecter.tsx'

type PathSelectorProps = {
    options: OptionSet[]
    value: readonly OptionSet[]
    onChange: (newValue: OptionSet[]) => void
}

const PathSelector = ({ options, value, onChange }: PathSelectorProps) => {
    return (
        <Select
            options={options}
            value={value}
            onChange={(newValue) => onChange([...newValue])}
            isMulti
            closeMenuOnSelect={false}
            menuPlacement="top"
            placeholder="命途筛选"
        />
    )
}

export default React.memo(PathSelector)
