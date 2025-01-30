import { Switch } from '@/components/ui/switch.tsx'
import { Label } from '@/components/ui/label.tsx'
import { ComponentProps } from 'react'

type SwitchWithLabelProps = {
    text: string
    id: string
} & ComponentProps<typeof Switch>

const SwitchWithLabel = ({ text, id, ...props }: SwitchWithLabelProps) => {
    return (
        <div className="flex items-center space-x-2">
            <Switch id={id} {...props} />
            <Label htmlFor={id}>{text}</Label>
        </div>
    )
}

export default SwitchWithLabel
