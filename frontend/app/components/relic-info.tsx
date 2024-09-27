'use client';
import useRelicStore from '@/app/hooks/use-relic-store';
import { Divider } from '@nextui-org/divider';
import useWindowStore from '@/app/hooks/use-window-store';
import { Chip } from '@nextui-org/chip';

export default function RelicInfo() {
  const { scanningStatus } = useWindowStore();
  const { relicInfo, relicError } = useRelicStore();

  const renderOCRResult = () => {
    if (!scanningStatus) {
      return <div className="font-semibold">选择模板后,开始扫描，显示遗器扫描内容</div>;
    }
    if (relicError) {
      return <div className="text-red-600">遗器扫描失败，请在正常模式下，检查下面日志/图片区域</div>;
    }

    return (
      <div className="mt-2 flex flex-col justify-center gap-2">
        <div className="font-black text-indigo-700">{relicInfo?.title.title}</div>

        <div className="flex items-center justify-center gap-2 font-semibold">
          {relicInfo?.main_stats.name}: {relicInfo?.main_stats.number}
          <Chip>{relicInfo?.main_stats.level}级</Chip>
        </div>

        <Divider />

        <div className="flex flex-col gap-2">
          {relicInfo?.sub_stats.map(subStat => (
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
