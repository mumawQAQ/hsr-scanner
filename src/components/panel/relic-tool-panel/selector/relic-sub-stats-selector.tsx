import { ChevronDown } from 'lucide-react';
import React from 'react';

import { Checkbox } from '@/components/ui/checkbox.tsx';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { RelicSubStatsType, ValuableSubStatsV2 } from '@/type/types.ts';

interface RelicMainStatsSelectorProps {
  selectedKeys: ValuableSubStatsV2[];
  onSelectionChange: (selectedKeys: ValuableSubStatsV2[]) => void;
  subStats: RelicSubStatsType[];
}

const RelicMainStatsSelector: React.FC<RelicMainStatsSelectorProps> = ({
  selectedKeys,
  onSelectionChange,
  subStats,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex cursor-pointer flex-row rounded-lg pl-2 text-indigo-500 hover:ring-1">
          选择 <ChevronDown />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="搜索副属性" />
          <CommandList>
            <CommandEmpty>没有找到对应副属性</CommandEmpty>
            <CommandGroup>
              {subStats.map(key => (
                <CommandItem key={key} value={key}>
                  <Checkbox
                    id={`sub-stats-selector-${key}`}
                    checked={selectedKeys ? selectedKeys.some(selectedKey => selectedKey.subStat === key) : false}
                    onCheckedChange={checked => {
                      if (checked) {
                        const newSelectedKey = {
                          subStat: key,
                          ratingScale: 1,
                        };
                        // Add to the selectedKeys
                        const newSelectedKeys = selectedKeys ? [...selectedKeys, newSelectedKey] : [newSelectedKey];
                        onSelectionChange(newSelectedKeys);
                      } else {
                        // Remove from the selectedKeys
                        if (selectedKeys) {
                          const newSelectedKeys = selectedKeys.filter(selectedKey => selectedKey.subStat !== key);
                          onSelectionChange(newSelectedKeys);
                        }
                      }
                    }}
                  />
                  <label
                    htmlFor={`sub-stats-selector-${key}`}
                    className="ml-2 flex text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <div className="w-64">{key}</div>
                  </label>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
export default RelicMainStatsSelector;
