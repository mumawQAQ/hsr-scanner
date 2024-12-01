'use client';
import useRelicStore from '@/app/hooks/use-relic-store';
import { Divider } from '@nextui-org/divider';
import useWindowStore from '@/app/hooks/use-window-store';
import { Chip } from '@nextui-org/chip';
import { Tooltip } from '@nextui-org/react';
import { CircleAlert } from 'lucide-react';
import React from 'react';

export default function RelicInfo() {
  const { singleRelicAnalysisId, autoRelicAnalysisId } = useWindowStore();
  const { relicInfo, relicError } = useRelicStore();

  const renderOCRResult = () => {
    if (!singleRelicAnalysisId && !autoRelicAnalysisId) {
      return <div className="font-semibold">选择模板后,开始扫描，显示遗器扫描内容</div>;
    }
    if (relicError) {
      return (
        <Tooltip content="请确保在正常模式下，打开左侧显示图片，并查看日志和图片异常">
          <div className="flex flex-row gap-2 text-red-600">
            <CircleAlert />
            {relicError}
          </div>
        </Tooltip>
      );
    }

    return (
      <div className="mt-2 flex flex-col justify-center gap-2">
        <div className="font-black text-indigo-700">{relicInfo?.relic_title?.title}</div>

        <div className="flex items-center justify-center gap-2 font-semibold">
          {relicInfo?.relic_main_stat?.name}: {relicInfo?.relic_main_stat?.number}
          <Chip>{relicInfo?.relic_main_stat?.level}级</Chip>
        </div>

        <Divider />

        <div className="flex flex-col gap-2">
          {relicInfo?.relic_sub_stat?.map(subStat => (
            <div key={subStat.name} className="flex items-center justify-center gap-2 font-semibold">
              {subStat.name}: {subStat.number}
              <Chip>{subStat.score.length > 1 ? subStat.score.join(' | ') : subStat.score[0]}</Chip>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return <div>{renderOCRResult()}</div>;
}
