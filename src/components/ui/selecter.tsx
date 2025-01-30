import { components, MultiValueGenericProps, OptionProps } from 'react-select'
import ImageDisplay from '@/components/image-display.tsx'
import { Input } from '@/components/ui/input.tsx'
import { useState } from 'react'

export type OptionSetWithIcon = {
    value: string
    label: string
    icon: string
}

export type OptionSetWithNumber = {
    value: string
    label: string
    number: number
}

export type OptionSet = {
    value: string
    label: string
}

export const CustomOption = (props: OptionProps<OptionSetWithIcon, true>) => {
    return (
        <components.Option {...props}>
            <div className="flex items-center gap-1">
                <ImageDisplay filePath={props.data.icon} width={20} height={20} />
                <span>{props.data.label}</span>
            </div>
        </components.Option>
    )
}

export const CustomMultiValueLabelWithIcon = (props: MultiValueGenericProps<OptionSetWithIcon>) => {
    return (
        <components.MultiValueLabel {...props}>
            <div className="flex items-center gap-1 flex-col">
                <ImageDisplay filePath={props.data.icon} width={20} height={20} className="rounded-full" />
                <span>{props.data.label}</span>
            </div>
        </components.MultiValueLabel>
    )
}

interface CustomMultiValueLabelProps extends MultiValueGenericProps<OptionSetWithNumber> {
    onNumberChange: (option: OptionSetWithNumber, newNumber: number) => void
}

export const CustomMultiValueLabelWithNumber = (props: CustomMultiValueLabelProps) => {
    const [localNumber, setLocalNumber] = useState(props.data.number)

    const handleBlur = () => {
        if (props.onNumberChange) {
            props.onNumberChange(props.data, localNumber)
        }
    }

    return (
        <components.MultiValueLabel {...props}>
            <div className="flex items-center gap-2 py-1 px-2">
                <span>{props.data.label}</span>
                <Input
                    type="number"
                    value={localNumber}
                    onChange={(e) => {
                        const value = Number(e.target.value)
                        if (value > 1) {
                            setLocalNumber(1)
                            return
                        }
                        setLocalNumber(value)
                    }}
                    onBlur={handleBlur}
                    className="w-[75px]"
                    min={0}
                    max={1}
                    step={0.05}
                />
            </div>
        </components.MultiValueLabel>
    )
}
