import React from 'react';

import { RelicRulesTemplate } from '../types.ts';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';

type TemplateToolTipProps = {
  trigger: React.ReactNode;
  template: RelicRulesTemplate;
};

const TemplateToolTip = ({ trigger, template }: TemplateToolTipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{trigger}</TooltipTrigger>
        <TooltipContent className="p-2">
          {template.valuableSub && (
            <div>
              有效副词条: <span className="font-semibold">{template.valuableSub.join(' | ')}</span>
            </div>
          )}
          {template.shouldLock && template.shouldLock.contain && (
            <div>
              锁定副词条数: <span className="font-semibold">{template.shouldLock.contain}</span>
            </div>
          )}
          {template.shouldLock &&
            template.shouldLock.include &&
            Object.entries(template.shouldLock.include).map(([, values], index) => (
              <div key={index}>
                锁定副词条: <span className="font-semibold">{values.join(' | ')}</span>
              </div>
            ))}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TemplateToolTip;
