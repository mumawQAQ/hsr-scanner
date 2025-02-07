import PathSelector from '@/pages/templates/path-selecter.tsx'
import { OptionSet, OptionSetWithIcon } from '@/components/ui/selecter.tsx'
import CharacterSelector from '@/pages/templates/character-selector.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'

type TemplateFiltersProps = {
    filterType: string
    setFilterType: (value: string) => void

    characterPathOptions: OptionSet[]
    selectedCharacterPath: readonly OptionSet[]
    setSelectedCharacterPath: (newValue: OptionSet[]) => void

    characterOptions: OptionSetWithIcon[]
    selectedCharacter: readonly OptionSetWithIcon[]
    setSelectedCharacter: (newValue: OptionSetWithIcon[]) => void
}

const TemplateFilters = ({
    filterType,
    setFilterType,
    characterPathOptions,
    selectedCharacterPath,
    setSelectedCharacterPath,
    characterOptions,
    selectedCharacter,
    setSelectedCharacter,
}: TemplateFiltersProps) => {
    const handleFilterTypeChange = (value: string) => {
        if (value !== filterType) {
            setFilterType(value)
            setSelectedCharacter([])
            setSelectedCharacterPath([])
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="w-[180px] self-end">
                <Select defaultValue={filterType} onValueChange={handleFilterTypeChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="筛选类型" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="character">角色</SelectItem>
                        <SelectItem value="path">命途</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="w-full">
                {filterType === 'path' ? (
                    <PathSelector
                        options={characterPathOptions}
                        value={selectedCharacterPath}
                        onChange={setSelectedCharacterPath}
                    />
                ) : (
                    <CharacterSelector
                        options={characterOptions}
                        value={selectedCharacter}
                        onChange={setSelectedCharacter}
                    />
                )}
            </div>
        </div>
    )
}

export default TemplateFilters
