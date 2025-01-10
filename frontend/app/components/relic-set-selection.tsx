import { useJsonFile } from '@/app/apis/files';
import { Autocomplete, AutocompleteItem, Spinner } from '@nextui-org/react';
import ImageDisplay from '@/app/components/image-display';
import { Chip } from '@nextui-org/chip';

export type RelicSetSelectionProps = {
  selectedRelicSets: string[] | undefined;
  onSelectionChange: (relicSet: string | null, type: 'add' | 'remove') => void;
};

export default function RelicSetSelection({ selectedRelicSets, onSelectionChange }: RelicSetSelectionProps) {
  const { data: relicSets, error, isLoading } = useJsonFile('relic/relic_sets.json');

  if (error || !relicSets) {
    console.error('Failed to fetch relic sets:', error);
    return null;
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Autocomplete
          label="选择遗物套装"
          variant="bordered"
          onSelectionChange={key => {
            const selectedKey = key as string;
            onSelectionChange(selectedKey, 'add');
          }}
        >
          {Object.keys(relicSets).map(relicSet => (
            <AutocompleteItem
              key={relicSet}
              startContent={<ImageDisplay filePath={relicSets[relicSet].icon} width={20} height={20} />}
            >
              {relicSets[relicSet].name}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedRelicSets?.map((relicSet, index) => (
          <Chip
            classNames={{
              content: 'max-w-[80px] text-ellipsis overflow-hidden',
            }}
            key={index}
            onClose={() => onSelectionChange(relicSet, 'remove')}
            variant="faded"
            startContent={<ImageDisplay filePath={relicSets[relicSet].icon} width={20} height={20} />}
          >
            <span>{relicSets[relicSet].name}</span>
          </Chip>
        ))}
      </div>
    </div>
  );
}
