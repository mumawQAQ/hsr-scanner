import { Badge } from '@/components/ui/badge.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { CharactersData } from '@/data/characters-data.ts';
import { cn } from '@/lib/utils.ts';
import { CharacterBasePartPotentialRating, CharacterBasePartRating } from '@/type/types.ts';

interface CharacterRatingBadgeProps {
  characterRating: CharacterBasePartRating | CharacterBasePartPotentialRating;
  type: '适配度' | '潜力值';
}

const CharacterRatingBadge = ({ characterRating, type }: CharacterRatingBadgeProps) => {
  const minRating = parseFloat(((characterRating.minTotalScore / characterRating.totalScore) * 100).toFixed(2));
  const maxRating = parseFloat(((characterRating.maxTotalScore / characterRating.totalScore) * 100).toFixed(2));

  // TODO: fix this text
  // const renderRatingText = () => {
  //   if (type == '适配度') {
  //     if (maxRating >= 0 && maxRating < 20) {
  //       return '依托答辩';
  //     } else if (maxRating >= 20 && maxRating < 40) {
  //       return '初级答辩';
  //     } else if (maxRating >= 40 && maxRating < 60) {
  //       return '中级答辩';
  //     } else if (maxRating >= 60 && maxRating < 80) {
  //       return '高级答辩';
  //     } else if (maxRating >= 80) {
  //       return '顶级答辩';
  //     }
  //   } else if (type == '潜力值') {
  //     if (maxRating >= 0 && maxRating < 20) {
  //       return '低潜力';
  //     } else if (maxRating >= 20 && maxRating < 40) {
  //       return '中潜力';
  //     } else if (maxRating >= 40 && maxRating < 60) {
  //       return '高潜力';
  //     } else if (maxRating >= 60 && maxRating < 80) {
  //       return '极高潜力';
  //     } else if (maxRating >= 80) {
  //       return '超高潜力';
  //     }
  //   }
  // };

  if (maxRating === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={'flex items-center gap-2 rounded-lg border-2 p-2'}>
          <Badge
            className={cn(
              'inline-flex flex-shrink-0 flex-row gap-2 overflow-hidden whitespace-nowrap text-sm font-black',
              {
                'border-gray-500 text-gray-500': maxRating >= 0 && maxRating < 20,
                'border-green-500 text-green-500': maxRating >= 20 && maxRating < 40,
                'border-blue-500 text-blue-500': maxRating >= 40 && maxRating < 60,
                'border-yellow-500 text-yellow-500': maxRating >= 60 && maxRating < 80,
                'border-red-500 text-red-500': maxRating >= 80,
              }
            )}
            variant="secondary"
          >
            <span className="truncate">{type}:</span>
            <span className="truncate">
              {minRating === maxRating ? `${minRating}%` : `${minRating}% - ${maxRating}%`}
            </span>
          </Badge>
          <div className="flex flex-wrap">
            {characterRating.character.map((character, index) => (
              <div key={index}>
                <img src={CharactersData[character].icon} alt="character" className="h-7 w-7 rounded-full" />
              </div>
            ))}
          </div>
        </TooltipTrigger>

        <TooltipContent>
          <div className="flex flex-col gap-2">
            {Object.keys(characterRating.valuableSub).map(subStat => (
              <div key={subStat} className="flex items-center justify-center gap-2 font-semibold">
                {subStat}
                <Badge
                  className={cn(
                    'inline-flex flex-row gap-2',
                    characterRating.valuableSub[subStat].valuable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  )}
                >
                  {characterRating.valuableSub[subStat].valuable ? '有效' : '无效'}
                </Badge>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
export default CharacterRatingBadge;
