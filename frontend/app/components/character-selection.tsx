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

  return selectedCharacter ? (
    <Chip
      onClose={() => onSelectionChange(null)}
      variant="faded"
      startContent={<ImageDisplay filePath={characters[selectedCharacter].icon} width={20} height={20} />}
    >
      <span>{characters[selectedCharacter].name}</span>
    </Chip>
  ) : (
    <Autocomplete
      classNames={{
        base: 'max-w-[150px]',
      }}
      variant="bordered"
      selectedKey={selectedCharacter}
      onSelectionChange={key => {
        const selectedKey = key as string;
        onSelectionChange(selectedKey);
      }}
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
  );
}
