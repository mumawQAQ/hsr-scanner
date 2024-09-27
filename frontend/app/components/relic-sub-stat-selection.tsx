import { RelicRuleSubStats } from '@/app/types/relic-rule-type';
import { RelicSubStatsType } from '@/app/types/relic-stat-types';
import { Autocomplete, AutocompleteItem, Slider } from '@nextui-org/react';
import { X } from 'lucide-react';

export type RelicSubStatSelectionProps = {
  selectedSubStats?: RelicRuleSubStats[];
  onSelectionChange: (subStat: RelicRuleSubStats, action: 'add' | 'remove' | 'update') => void;
};
export default function RelicSubStatSelection({ selectedSubStats, onSelectionChange }: RelicSubStatSelectionProps) {
  const selectionItems = RelicSubStatsType;
  const selectionKeys = Object.keys(selectionItems);

  return (
    <div>
      <Autocomplete
        classNames={{
          base: 'max-w-[150px]',
          listboxWrapper: 'max-h-[320px]',
        }}
        inputProps={{
          classNames: {
            input: 'ml-1',
            inputWrapper: 'h-[30px]',
          },
        }}
        variant="bordered"
        onSelectionChange={key => {
          const selectedKey = key as string;
          if (selectedKey === null) return;
          onSelectionChange(
            {
              sub_stat: selectedKey,
              rating_scale: 0.05,
            },
            'add'
          );
        }}
      >
        {selectionKeys.map(subStat => (
          <AutocompleteItem key={subStat}>{selectionItems[subStat]}</AutocompleteItem>
        ))}
      </Autocomplete>

      <div className="flex flex-col gap-2">
        {selectedSubStats?.map((subStat, index) => (
          <div key={index}>
            <X size={16} onClick={() => onSelectionChange(subStat, 'remove')} />
            <span>{selectionItems[subStat.sub_stat]}</span>
            <Slider
              label="评分占比"
              minValue={0.05}
              maxValue={1}
              step={0.05}
              value={subStat.rating_scale}
              onChange={value => {
                if (typeof value !== 'number') return;
                const newValue = value as number;
                onSelectionChange(
                  {
                    ...subStat,
                    rating_scale: newValue,
                  },
                  'update'
                );
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
