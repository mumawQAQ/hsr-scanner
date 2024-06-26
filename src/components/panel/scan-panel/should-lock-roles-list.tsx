import { Minus, Plus } from 'lucide-react';
import * as React from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import SubStatsDropDown from '@/components/panel/scan-panel/sub-stats-drop-down.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Label } from '@/components/ui/label.tsx';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.tsx';
import useRelicStore from '@/hooks/use-relic-store.ts';
import relicUtils from '@/utils/relicRatingUtils.ts';

const ShouldLockRolesList: React.FC = () => {
  const defaultContain = '';

  const { relicTitle, mainRelicStats, relicRatingInfo } = useRelicStore(state => ({
    relicTitle: state.relicTitle,
    mainRelicStats: state.mainRelicStats,
    relicRatingInfo: state.relicRatingInfo,
  }));

  const [isEditingContain, setIsEditingContain] = React.useState(false);
  const [containSelected, setContainSelected] = React.useState(relicRatingInfo?.shouldLock.contain || defaultContain);
  const [includeSelected, setIncludeSelected] = React.useState<{
    [key: string]: string[];
  }>(relicRatingInfo?.shouldLock.include || {});

  useEffect(() => {
    setContainSelected(relicRatingInfo?.shouldLock.contain || defaultContain);
    setIncludeSelected(relicRatingInfo?.shouldLock.include || {});
  }, [relicRatingInfo]);

  if (!relicTitle || !mainRelicStats || !relicRatingInfo?.shouldLock) {
    return null;
  }

  const handleContainChange = async (value: string) => {
    const newRelicRatingInfo = { ...relicRatingInfo };
    newRelicRatingInfo.shouldLock.contain = value;
    const result = await relicUtils.updateRelicRatingShouldLock(
      relicTitle,
      mainRelicStats.name,
      newRelicRatingInfo.shouldLock
    );
    if (result.success) {
      setIsEditingContain(false);
    } else {
      toast(result.message, { type: 'error' });
    }
  };

  const handleDeleteContainRule = async () => {
    const newRelicRatingInfo = { ...relicRatingInfo };
    newRelicRatingInfo.shouldLock.contain = defaultContain;
    const result = await relicUtils.updateRelicRatingShouldLock(
      relicTitle,
      mainRelicStats.name,
      newRelicRatingInfo.shouldLock
    );
    if (result.success) {
      setIsEditingContain(false);
    } else {
      toast(result.message, { type: 'error' });
    }
  };

  const handleIncludeChange = async (id: string, selectedKeys: string[]) => {
    if (selectedKeys.length > 4) {
      toast('同时拥有的副属性不能超过4条', { type: 'error' });
      return;
    }

    // check if the value sub contains all the selected keys
    const valuableSub = relicRatingInfo.valuableSub;
    // if the selected keys are not in the valuableSub, add them
    selectedKeys.forEach(key => {
      if (!valuableSub.includes(key)) {
        valuableSub.push(key);
      }
    });

    // update the valuableSub
    const valuableSubResult = await relicUtils.updateRelicRatingValuableSub(
      relicTitle,
      mainRelicStats.name,
      valuableSub
    );
    if (!valuableSubResult.success) {
      toast(valuableSubResult.message, { type: 'error' });
      return;
    }

    const newRelicRatingInfo = { ...relicRatingInfo };
    newRelicRatingInfo.shouldLock.include[id] = [...selectedKeys];

    const result = await relicUtils.updateRelicRatingShouldLock(
      relicTitle,
      mainRelicStats.name,
      newRelicRatingInfo.shouldLock
    );
    if (!result.success) {
      toast(result.message, { type: 'error' });
    }
  };

  const handleDeleteIncludeRule = async (id: string) => {
    const newRelicRatingInfo = { ...relicRatingInfo };
    delete newRelicRatingInfo.shouldLock.include[id];

    const result = await relicUtils.updateRelicRatingShouldLock(
      relicTitle,
      mainRelicStats.name,
      newRelicRatingInfo.shouldLock
    );
    if (!result.success) {
      toast(result.message, { type: 'error' });
    }
  };

  return (
    <div className={'flex h-fit w-min flex-col items-center justify-center'}>
      <div className={'text-nowrap font-bold'}>建议锁定规则</div>
      <ul className={'float-left mt-2 flex flex-col gap-2'}>
        {isEditingContain && (
          <li>
            <RadioGroup className={'text-nowrap p-2'} value={containSelected} onValueChange={handleContainChange}>
              {[1, 2, 3, 4].map(value => {
                return (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={value.toString()} id={`option-${value}`} />
                    <Label htmlFor={`option-${value}`}>{`包含${value}条有效属性`}</Label>
                  </div>
                );
              })}
            </RadioGroup>
          </li>
        )}
        <li>
          <div className="flex flex-row items-center justify-center">
            <Badge
              onClick={() => {
                setIsEditingContain(true);
              }}
              className="text-nowrap"
            >
              {!containSelected ? '暂未启用包含有效属性的条数' : `包含${containSelected}条有效属性`}
            </Badge>
            {containSelected && (
              <Minus
                className={
                  'ml-2 cursor-pointer rounded border-2 border-red-600 text-red-600 transition-all hover:border-red-500/80 hover:text-red-500/80'
                }
                onClick={handleDeleteContainRule}
              />
            )}
          </div>
        </li>
        <li className="flex flex-col items-center justify-center gap-2">
          <div>
            <ul className={'flex flex-col gap-2'}>
              {Object.keys(includeSelected).map(id => {
                return (
                  <li key={id} className={'flex flex-row justify-center gap-1 align-middle'}>
                    <SubStatsDropDown
                      trigger={
                        <div className={'text-nowrap rounded-2xl bg-black px-2 py-1 text-xs text-white'}>
                          同时拥有
                          <span className={'ml-1 font-bold'}>
                            {[...includeSelected[id]].map(stat => stat).join(' | ')}
                          </span>
                        </div>
                      }
                      selectedKeys={includeSelected[id]}
                      onSelectionChange={async selectedKeys => {
                        await handleIncludeChange(id, selectedKeys);
                      }}
                    />
                    <Minus
                      className={
                        'ml-2 cursor-pointer rounded border-2 border-red-600 text-red-600 transition-all hover:border-red-500/80 hover:text-red-500/80'
                      }
                      onClick={async () => {
                        await handleDeleteIncludeRule(id);
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
          <Badge
            className={'flex cursor-pointer flex-row justify-center'}
            onClick={() => {
              setIncludeSelected({
                ...includeSelected,
                [Object.keys(includeSelected).length + 1]: [],
              });
            }}
          >
            <Plus className="h-4 w-4" /> 添加新规则
          </Badge>
        </li>
      </ul>
    </div>
  );
};

export default ShouldLockRolesList;
