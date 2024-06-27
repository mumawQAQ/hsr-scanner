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
import { RelicSets } from '@/types.ts';

type RelicSetSelectorProps = {
  trigger: React.ReactNode;
  selectedKeys: string[];
  onSelectionChange: (selectedKeys: string[]) => void;
};

const RelicSetSelector: React.FC<RelicSetSelectorProps> = ({ trigger, selectedKeys, onSelectionChange }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="搜索套装" />
          <CommandList>
            <CommandEmpty>没有找到对应套装</CommandEmpty>
            <CommandGroup>
              {Object.entries(RelicSets).map(([key, value]) => (
                <CommandItem key={key} value={value.name}>
                  <Checkbox
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
                  <label className="ml-2 flex text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    <img src={value.icon} alt="relic icon" className="h-4 w-4" />
                    {value.name}
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
export default RelicSetSelector;
