import SettingsIcon from '@mui/icons-material/Settings';
import { Chip } from '@nextui-org/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import SubStatsDropDown from '@/components/SubStatsDropDown.tsx';
import useRelicStore from '@/store/relicStore.ts';
import relicUtils from '@/utils/relicUtils.ts';

const ValuableSubList: React.FC = () => {
  const { relicTitle, mainRelicStats, relicRatingInfo, fetchRelicRatingInfo } = useRelicStore();

  const [selectedStats, setSelectedStats] = useState<Set<string>>(new Set([]));

  useEffect(() => {
    setSelectedStats(new Set(relicRatingInfo?.valuableSub || []));
  }, [relicRatingInfo]);

  if (!relicTitle || !mainRelicStats || !relicRatingInfo?.valuableSub) {
    return null;
  }

  const onSelectionChange = async (selectedKeys: Set<string>) => {
    console.log('selectedKeys', [...selectedKeys]);

    const result = await relicUtils.updateRelicRatingValuableSub(relicTitle, mainRelicStats.name, [...selectedKeys]);

    if (result.success) {
      // Update the state only after the successful update to ensure consistency
      setSelectedStats(new Set(selectedKeys)); // Update state if successful
      await fetchRelicRatingInfo();
      console.log(result.message);
    } else {
      toast(result.message, { type: 'error' });
    }
  };

  return (
    <div className={'h-fit w-min'}>
      <SubStatsDropDown
        trigger={
          <div className="flex cursor-pointer flex-row gap-2">
            <div className={'text-nowrap font-bold'}>有效副属性</div>
            <SettingsIcon />
          </div>
        }
        selectedKeys={selectedStats}
        onSelectionChange={onSelectionChange}
      />
      <ul className={'float-left mt-2 flex flex-col gap-2'}>
        {[...selectedStats].map((valuableSubStat, index) => {
          return (
            <li key={index}>
              <Chip color="success" variant="shadow" radius="sm">
                {valuableSubStat}
              </Chip>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ValuableSubList;
