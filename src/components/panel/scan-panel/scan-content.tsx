import { useEffect, useState } from 'react';

import CharacterRatingBadge from '@/components/panel/scan-panel/character-rating-badge.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import useRelicStore from '@/hooks/use-relic-store.ts';
import useWindowStore from '@/hooks/use-window-store.ts';
import { CharacterBasePartPotentialRating, CharacterBasePartRating, RelicInfo } from '@/type/types.ts';

const ScanContent = () => {
  const { relicInfo, relicError } = useRelicStore();
  const { scanningStatus } = useWindowStore();

  const [relicGrowthRate, setRelicGrowthRate] = useState<{
    minGrowthScore: number;
    maxGrowthScore: number;
    maxScore: number;
  } | null>(null);
  const [characterBasePartRatingList, setCharacterBasePartRatingList] = useState<CharacterBasePartRating[]>([]);
  const [characterBasePartPotentialRatings, setCharacterBasePartPotentialRatings] = useState<
    CharacterBasePartPotentialRating[]
  >([]);

  useEffect(() => {
    if (relicInfo) {
      calculateRelicGrowthRate(relicInfo);
    }
  }, [relicInfo]);

  /**
   * Calculate the relic growth rate
   * @param relicInfo The relic information
   */
  function calculateRelicGrowthRate(relicInfo: RelicInfo) {
    const relicGrowthRate = {
      minGrowthScore: 0,
      maxGrowthScore: 0,
      // The relic can have 3-4 sub stats at level 0,
      // each 3 levels increase the score by 1
      maxScore: relicInfo.mainStats.enhanceLevel + 4,
    };

    // Calculate the current relic score
    for (const element of relicInfo.subStats) {
      const subStat = element;
      const maxScore = Math.max(...subStat.score);
      const minScore = Math.min(...subStat.score);
      relicGrowthRate.maxGrowthScore += maxScore;
      relicGrowthRate.minGrowthScore += minScore;
    }

    relicGrowthRate.maxGrowthScore = parseFloat(relicGrowthRate.maxGrowthScore.toFixed(2));
    relicGrowthRate.minGrowthScore = parseFloat(relicGrowthRate.minGrowthScore.toFixed(2));

    setRelicGrowthRate(relicGrowthRate);
  }

  const renderOCRResult = () => {
    if (!scanningStatus) {
      return <div className="font-semibold">选择模板后,开始扫描，显示遗器扫描内容</div>;
    }

    if (relicError) {
      return <div className="text-red-600">遗器扫描失败，请在正常模式下，检查下面日志/图片区域</div>;
    }

    return (
      <div className="mt-2 flex flex-col gap-2">
        <div className="font-black text-indigo-700">{relicInfo?.title.title}</div>

        <div className="flex items-center justify-center gap-2 font-semibold">
          {relicInfo?.mainStats.name}: {relicInfo?.mainStats.number}
          <Badge>{relicInfo?.mainStats.level}级</Badge>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          {relicInfo?.subStats.map(subStat => (
            <div key={subStat.name} className="flex items-center justify-center gap-2 font-semibold">
              {subStat.name}: {subStat.number}
              <Badge>{subStat.score.length > 1 ? subStat.score.join(' | ') : subStat.score[0]}</Badge>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRelicGrowthRate = () => {
    if (!relicGrowthRate) {
      return null;
    }

    return (
      <div className="flex items-center justify-center gap-2">
        <span className="font-semibold">遗器成长率: </span>
        <Badge className={'inline-flex flex-row gap-2'}>
          <span>
            {relicGrowthRate.maxGrowthScore === relicGrowthRate.minGrowthScore
              ? relicGrowthRate.maxGrowthScore
              : `${relicGrowthRate.minGrowthScore} - ${relicGrowthRate.maxGrowthScore}`}
          </span>
          <span> / </span>
          <span>{relicGrowthRate.maxScore}</span>
        </Badge>
      </div>
    );
  };

  const renderCharacterBasePartRatingList = () => {
    if (characterBasePartRatingList.length === 0 && characterBasePartPotentialRatings.length === 0) {
      return <div className="font-semibold">暂无适用角色评分/潜力</div>;
    }

    return (
      <ScrollArea className="h-[300px]">
        {characterBasePartRatingList.length > 0 && (
          <div className="flex flex-col gap-2">
            {characterBasePartRatingList.map((rating, index) => (
              <CharacterRatingBadge characterRating={rating} type={'适配度'} key={index} />
            ))}
          </div>
        )}

        {characterBasePartPotentialRatings.length > 0 && (
          <div className="flex flex-col gap-2">
            {characterBasePartPotentialRatings.map((rating, index) => (
              <CharacterRatingBadge characterRating={rating} type={'潜力值'} key={index} />
            ))}
          </div>
        )}
      </ScrollArea>
    );
  };

  return (
    <div className="flex w-full flex-row gap-2 text-center">
      <div className="w-1/2">
        {renderRelicGrowthRate()}
        {renderOCRResult()}
      </div>
      <div className="w-1/2">{renderCharacterBasePartRatingList()}</div>
    </div>
  );
};

export default ScanContent;
