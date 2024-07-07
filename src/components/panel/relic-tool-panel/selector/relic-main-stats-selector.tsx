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
import {
  RelicBodyMainStatsType,
  RelicGloveMainStatsType,
  RelicHeadMainStatsType,
  RelicRopeMainStatsType,
  RelicShoeMainStatsType,
  RelicSphereMainStatsType,
} from '@/type/types.ts';

interface RelicMainStatsSelectorProps {
  partName: string;
  selectedKeys: string[];
  onSelectionChange: (selectedKeys: string[]) => void;
  mainStats:
    | RelicHeadMainStatsType[]
    | RelicGloveMainStatsType[]
    | RelicBodyMainStatsType[]
    | RelicShoeMainStatsType[]
    | RelicSphereMainStatsType[]
    | RelicRopeMainStatsType[];
}

const RelicMainStatsSelector: React.FC<RelicMainStatsSelectorProps> = ({
  partName,
  selectedKeys,
  onSelectionChange,
  mainStats,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="mr-2 flex flex-row items-center">
      <div className="mr-2 flex font-semibold">{partName}:</div>
      {mainStats.length > 1 ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="flex cursor-pointer flex-row rounded-lg pl-2 text-indigo-500 hover:ring-1">
              选择 <ChevronDown />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <Command>
              <CommandInput placeholder="搜索主属性" />
              <CommandList>
                <CommandEmpty>没有找到对应主属性</CommandEmpty>
                <CommandGroup>
                  {mainStats.map(key => (
                    <CommandItem key={key} value={key}>
                      <Checkbox
                        id={`sub-main-selector-${key}`}
                        checked={selectedKeys ? selectedKeys.includes(key) : false}
                        onCheckedChange={checked => {
                          if (checked) {
                            // Add to the selectedKeys
                            const newSelectedKeys = selectedKeys ? [...selectedKeys, key] : [key];
                            onSelectionChange(newSelectedKeys);
                          } else {
                            // Remove from the selectedKeys
                            if (selectedKeys) {
                              const newSelectedKeys = selectedKeys.filter(selectedKey => selectedKey !== key);
                              onSelectionChange(newSelectedKeys);
                            }
                          }
                        }}
                      />
                      <label
                        htmlFor={`sub-main-selector-${key}`}
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
      ) : (
        <div className="flex flex-row rounded-lg">
          {mainStats.map(key => (
            <div key={key} className={'flex flex-row'}>
              <Checkbox
                id={`sub-main-selector-${key}`}
                checked={selectedKeys ? selectedKeys.includes(key) : false}
                onCheckedChange={checked => {
                  if (checked) {
                    // Add to the selectedKeys
                    const newSelectedKeys = selectedKeys ? [...selectedKeys, key] : [key];
                    onSelectionChange(newSelectedKeys);
                  } else {
                    // Remove from the selectedKeys
                    if (selectedKeys) {
                      const newSelectedKeys = selectedKeys.filter(selectedKey => selectedKey !== key);
                      onSelectionChange(newSelectedKeys);
                    }
                  }
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default RelicMainStatsSelector;
