import * as React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import SubStatsDropDown from '@/components/panel/scan-panel/sub-stats-drop-down.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import useRelicStore from '@/hooks/use-relic-store.ts';
import relicUtils from '@/utils/relicRatingUtils.ts';

const ValuableSubList: React.FC = () => {
  const { relicTitle, mainRelicStats, relicRatingInfo } = useRelicStore(state => ({
    relicTitle: state.relicTitle,
    mainRelicStats: state.mainRelicStats,
    relicRatingInfo: state.relicRatingInfo,
  }));

  const [selectedStats, setSelectedStats] = useState<string[]>([]);

  useEffect(() => {
    setSelectedStats(relicRatingInfo?.valuableSub || []);
  }, [relicRatingInfo]);

  if (!relicTitle || !mainRelicStats || !relicRatingInfo?.valuableSub) {
    return null;
  }

  const onSelectionChange = async (selectedKeys: string[]) => {
    console.log('selectedKeys', [...selectedKeys]);

    const result = await relicUtils.updateRelicRatingValuableSub(relicTitle, mainRelicStats.name, selectedKeys);

    if (result.success) {
      // Update the state only after the successful update to ensure consistency
      setSelectedStats(selectedKeys); // Update state if successful
    } else {
      toast(result.message, { type: 'error' });
    }
  };

  return (
    <div className={'h-fit w-min'}>
      <SubStatsDropDown
        trigger={
          <div className="flex cursor-pointer flex-row gap-2">
            <div className={'text-nowrap font-semibold'}>有效副属性</div>
          </div>
        }
        selectedKeys={selectedStats}
        onSelectionChange={onSelectionChange}
      />
      <ul className={'float-left mt-2 flex flex-col gap-2'}>
        {[...selectedStats].map((valuableSubStat, index) => {
          return (
            <li key={index} className={'text-nowrap'}>
              <Badge>{valuableSubStat}</Badge>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ValuableSubList;
