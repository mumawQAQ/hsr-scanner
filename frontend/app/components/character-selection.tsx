import { useJsonFile } from '@/app/apis/files';
import { Autocomplete, AutocompleteItem, Spinner } from '@nextui-org/react';
import ImageDisplay from '@/app/components/image-display';

export default function CharacterSelection() {
  const { data: characters, error, isLoading } = useJsonFile('character/character_meta.json');

  if (error || !characters) {
    console.error('Failed to fetch characters:', error);
    return null;
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Autocomplete className="max-w-xs" label="选择角色">
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
