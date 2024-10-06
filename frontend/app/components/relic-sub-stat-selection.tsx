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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="font-semibold">选择副属性: </span>
        <Autocomplete
          classNames={{
            base: 'max-w-[150px]',
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
                name: selectedKey,
                rating_scale: 0.05,
              },
              'add',
            );
          }}
        >
          {selectionKeys.map(subStat => (
            <AutocompleteItem key={subStat}>{selectionItems[subStat]}</AutocompleteItem>
          ))}
        </Autocomplete>
      </div>

      <div className="flex flex-wrap gap-4">
        {selectedSubStats?.map((subStat, index) => (
          <div key={index} className="mb-2 flex items-start rounded-xl bg-white p-4 shadow">
            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">{selectionItems[subStat.name]}</span>
                <X
                  size={20}
                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={() => onSelectionChange(subStat, 'remove')}
                  aria-label="Remove selection"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label htmlFor={`slider-${index}`} className="text-sm text-gray-600">
                  评分占比
                </label>
                <Slider
                  size="sm"
                  id={`slider-${index}`}
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
                      'update',
                    );
                  }}
                  className="min-w-20 flex-1"
                />
                <span className="w-12 text-right text-gray-700">{(subStat.rating_scale * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
