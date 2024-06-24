import { Add, Delete } from '@mui/icons-material';
import { Chip, Radio, RadioGroup } from '@nextui-org/react';
import * as React from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import SubStatsDropDown from '@/components/SubStatsDropDown.tsx';
import useRelicStore from '@/store/relicStore.ts';
import relicUtils from '@/utils/relicUtils.ts';

const includeListObjToSet = (includeObj: { [p: string]: string[] } | undefined) => {
  const includeSet: { [key: string]: Set<string> } = {};
  if (!includeObj) {
    return includeSet;
  }
  Object.keys(includeObj).forEach(key => {
    if (includeObj[key]) {
      includeSet[key] = new Set(includeObj[key]);
    }
  });
  return includeSet;
};

const ShouldLockRulesList: React.FC = () => {
  const defaultContain = '';

  const { relicTitle, mainRelicStats, relicRatingInfo, fetchRelicRatingInfo } = useRelicStore();

  const [isEditingContain, setIsEditingContain] = React.useState(false);
  const [containSelected, setContainSelected] = React.useState(relicRatingInfo?.shouldLock.contain || defaultContain);
  const [includeSelected, setIncludeSelected] = React.useState<{
    [key: string]: Set<string>;
  }>(includeListObjToSet(relicRatingInfo?.shouldLock.include));

  useEffect(() => {
    setContainSelected(relicRatingInfo?.shouldLock.contain || defaultContain);
    setIncludeSelected(includeListObjToSet(relicRatingInfo?.shouldLock.include));
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
      await fetchRelicRatingInfo();
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
      await fetchRelicRatingInfo();
    } else {
      toast(result.message, { type: 'error' });
    }
  };

  const handleIncludeChange = async (id: string, selectedKeys: Set<string>) => {
    if (selectedKeys.size > 4) {
      toast('同时拥有的副属性不能超过4条', { type: 'error' });
      return;
    }
    const newRelicRatingInfo = { ...relicRatingInfo };
    newRelicRatingInfo.shouldLock.include[id] = [...selectedKeys];

    const result = await relicUtils.updateRelicRatingShouldLock(
      relicTitle,
      mainRelicStats.name,
      newRelicRatingInfo.shouldLock
    );
    if (result.success) {
      await fetchRelicRatingInfo();
    } else {
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
    if (result.success) {
      // Update the state only after the successful update to ensure consistency
      await fetchRelicRatingInfo();
    } else {
      toast(result.message, { type: 'error' });
    }
  };

  return (
    <div className={'flex h-fit w-min flex-col justify-center'}>
      <div className={'text-nowrap font-bold'}>建议锁定规则</div>
      <ul className={'float-left mt-2 flex flex-col gap-2'}>
        {isEditingContain && (
          <li>
            <RadioGroup className={'text-nowrap p-2'} value={containSelected} onValueChange={handleContainChange}>
              <Radio value="1">包含1条有效属性</Radio>
              <Radio value="2">包含2条有效属性</Radio>
              <Radio value="3">包含3条有效属性</Radio>
              <Radio value="4">包含4条有效属性</Radio>
            </RadioGroup>
          </li>
        )}
        <li>
          <div className="flex flex-row items-center justify-center">
            <Chip
              color={containSelected ? 'success' : 'warning'}
              radius={'sm'}
              variant={'shadow'}
              onClick={() => {
                setIsEditingContain(true);
              }}
            >
              {!containSelected ? '暂未启用包含有效属性的条数' : `包含${containSelected}条有效属性`}
            </Chip>
            <div onClick={handleDeleteContainRule}>
              <Delete color={'error'} />
            </div>
          </div>
        </li>
        <li>
          <div className={'flex flex-col justify-center gap-2'}>
            <ul className={'flex flex-col gap-2'}>
              {Object.keys(includeSelected).map(id => {
                return (
                  <li key={id} className={'flex flex-row justify-center gap-1 align-middle'}>
                    <SubStatsDropDown
                      trigger={
                        <Chip color="success" className={'cursor-pointer'} radius="sm" variant="shadow">
                          同时拥有
                          <span className={'ml-1 font-bold'}>
                            {[...includeSelected[id]].map(stat => stat).join(' | ')}
                          </span>
                        </Chip>
                      }
                      selectedKeys={includeSelected[id]}
                      onSelectionChange={async selectedKeys => {
                        await handleIncludeChange(id, selectedKeys);
                      }}
                    />
                    <div
                      onClick={async () => {
                        await handleDeleteIncludeRule(id);
                      }}
                    >
                      <Delete color={'error'} className={'cursor-pointer'} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <Chip
            color="warning"
            variant="shadow"
            radius="sm"
            startContent={<Add />}
            className={'mt-3 cursor-pointer'}
            onClick={() => {
              setIncludeSelected({
                ...includeSelected,
                [Object.keys(includeSelected).length + 1]: new Set(),
              });
            }}
          >
            添加新规则
          </Chip>
        </li>
      </ul>
    </div>
  );
};

export default ShouldLockRulesList;
