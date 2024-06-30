import { Badge } from '@/components/ui/badge.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { CharactersData } from '@/data/characters-data.ts';
import { cn } from '@/lib/utils.ts';
import { CharacterBasePartRating } from '@/type/types.ts';

interface CharacterRatingBadgeProps {
  relicGrowthRate: {
    minGrowthScore: number;
    maxGrowthScore: number;
    maxScore: number;
  };
  characterRating: CharacterBasePartRating;
}

const CharacterRatingBadge = ({ relicGrowthRate, characterRating }: CharacterRatingBadgeProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={'flex items-center gap-2 rounded-lg border-2 p-2'}>
          <Badge
            className={'inline-flex flex-shrink-0 flex-row gap-2 overflow-hidden whitespace-nowrap text-sm font-black'}
            variant="secondary"
          >
            <span className="truncate">适配度:</span> {/* Use truncate class to truncate text */}
            <span className="truncate">
              {characterRating.minTotalScore === characterRating.maxTotalScore
                ? `${parseFloat((characterRating.minTotalScore / (relicGrowthRate?.maxScore ?? 1)).toFixed(2)) * 100}%`
                : `${parseFloat((characterRating.minTotalScore / (relicGrowthRate?.maxScore ?? 1)).toFixed(2)) * 100}% - ${parseFloat((characterRating.maxTotalScore / (relicGrowthRate?.maxScore ?? 1)).toFixed(2)) * 100}%`}
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
