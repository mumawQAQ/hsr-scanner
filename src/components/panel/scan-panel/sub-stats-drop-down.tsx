import React from 'react';

import { AllSubStats } from '../../../types.ts';

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

type ISubStatsDropDownProps = {
  trigger: React.ReactNode;
  selectedKeys: string[];
  onSelectionChange: (selectedKeys: string[]) => void;
};

const SubStatsDropDown: React.FC<ISubStatsDropDownProps> = ({ trigger, selectedKeys, onSelectionChange }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="搜索副属性" />
          <CommandList>
            <CommandEmpty>没有找到对应副属性</CommandEmpty>
            <CommandGroup>
              {AllSubStats.map(subStats => (
                <CommandItem key={subStats} value={subStats}>
                  <Checkbox
                    checked={[...selectedKeys].includes(subStats)}
                    onCheckedChange={checked => {
                      return checked
                        ? onSelectionChange([...selectedKeys, subStats])
                        : onSelectionChange(selectedKeys.filter(key => key !== subStats));
                    }}
                  />
                  <label className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {subStats}
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
export default SubStatsDropDown;
