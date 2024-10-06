import { Autocomplete, AutocompleteItem } from '@nextui-org/react';
import {
  RelicBodyMainStatsType,
  RelicFeetMainStatsType,
  RelicHandMainStatsType,
  RelicHeadMainStatsType,
  RelicMainStatsType,
  RelicRopeMainStatsType,
  RelicSphereMainStatsType,
} from '@/app/types/relic-stat-types';
import { Chip } from '@nextui-org/chip';
import { Plus } from 'lucide-react';

export type RelicMainStatSelectionProps = {
  type: RelicMainStatsType;
  selectedMainStat?: string[];
  onSelectionChange: (mainStat: string | null, type: 'add' | 'remove') => void;
};

export default function RelicMainStatSelection({
                                                 type,
                                                 selectedMainStat,
                                                 onSelectionChange,
                                               }: RelicMainStatSelectionProps) {
  const getSelectionItems = () => {
    switch (type) {
      case 'head':
        return RelicHeadMainStatsType;
      case 'hand':
        return RelicHandMainStatsType;
      case 'body':
        return RelicBodyMainStatsType;
      case 'feet':
        return RelicFeetMainStatsType;
      case 'rope':
        return RelicRopeMainStatsType;
      case 'sphere':
        return RelicSphereMainStatsType;
    }
  };

  const selectionItems = getSelectionItems();
  const selectionKeys = Object.keys(selectionItems);
  const translatedType = {
    head: '头部',
    hand: '手部',
    body: '身体',
    feet: '脚部',
    rope: '绳',
    sphere: '球',
  };

  if (selectionKeys.length === 1) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-semibold">选择{translatedType[type]}主属性: </span>
        {selectedMainStat && selectedMainStat.length > 0 ? (
          <Chip
            onClose={() => {
              console.log('remove');
              onSelectionChange(selectedMainStat[0], 'remove');
            }}
            variant="faded"
            color="primary"
          >
            {selectionItems[selectionKeys[0]]}
          </Chip>
        ) : (
          <Chip
            variant="faded"
            endContent={
              <Plus
                size={16}
                onClick={() => {
                  console.log('add');
                  onSelectionChange(selectionKeys[0], 'add');
                }}
              />
            }
          >
            {selectionItems[selectionKeys[0]]}
          </Chip>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="font-semibold">选择{translatedType[type]}主属性: </span>
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
            onSelectionChange(selectedKey, 'add');
          }}
        >
          {selectionKeys.map(mainStat => (
            <AutocompleteItem key={mainStat}>{selectionItems[mainStat]}</AutocompleteItem>
          ))}
        </Autocomplete>
      </div>

      <div className="flex gap-2 flex-wrap">
        {selectedMainStat?.map((mainStats, index) => (
          <Chip key={index} onClose={() => onSelectionChange(mainStats, 'remove')} variant="faded">
            <span>{selectionItems[mainStats]}</span>
          </Chip>
        ))}
      </div>
    </div>
  );
}
