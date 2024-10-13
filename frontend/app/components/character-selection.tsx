import { useJsonFile } from '@/app/apis/files';
import { Autocomplete, AutocompleteItem, Spinner } from '@nextui-org/react';
import ImageDisplay from '@/app/components/image-display';
import { Chip } from '@nextui-org/chip';

export type CharacterSelectionProps = {
  selectedCharacter: string | undefined;
  onSelectionChange: (character: string | null) => void;
};

export default function CharacterSelection({ selectedCharacter, onSelectionChange }: CharacterSelectionProps) {
  const { data: characters, error, isLoading } = useJsonFile('character/character_meta.json');

  if (error || !characters) {
    console.error('Failed to fetch characters:', error);
    return null;
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {selectedCharacter ? (
        <Chip
          onClose={() => onSelectionChange(null)}
          variant="faded"
          startContent={
            <ImageDisplay filePath={characters[selectedCharacter].icon} width={40} height={40} className="rounded-lg" />
          }
          classNames={{
            base: 'min-w-[150px] min-h-[50px] pl-3',
            content: 'flex items-center justify-center font-semibold text-lg',
          }}
        >
          <span>{characters[selectedCharacter].name}</span>
        </Chip>
      ) : (
        <Autocomplete
          classNames={{
            base: 'max-w-[150px] min-h-[50px]',
          }}
          variant="bordered"
          selectedKey={selectedCharacter}
          onSelectionChange={key => {
            const selectedKey = key as string;
            onSelectionChange(selectedKey);
          }}
          label="选择角色"
        >
          {Object.keys(characters).map(character => (
            <AutocompleteItem
              key={character}
              startContent={<ImageDisplay filePath={characters[character].icon} width={20} height={20} />}
            >
              {characters[character].name}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      )}
    </div>
  );
}
