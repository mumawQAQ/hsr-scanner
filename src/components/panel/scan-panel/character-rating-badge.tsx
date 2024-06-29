import { Badge } from '@/components/ui/badge.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { CharactersData } from '@/data/characters-data.ts';
import { cn } from '@/lib/utils.ts';
import { CharacterBasePartRating } from '@/type/types.ts';

interface CharacterRatingBadgeProps {
  characterRating: CharacterBasePartRating;
  order: number;
}

const CharacterRatingBadge = ({ characterRating, order }: CharacterRatingBadgeProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={'flex items-center gap-2 rounded-lg border-2 p-2'}>
          <div className="text-sm font-black">{order}</div>
          <Badge
            className={'inline-flex flex-shrink-0 flex-row gap-2 overflow-hidden whitespace-nowrap text-sm font-black'}
            variant="secondary"
          >
            <span className="truncate">成长率:</span> {/* Use truncate class to truncate text */}
            <span className="truncate">
              {characterRating.minTotalScore === characterRating.maxTotalScore
                ? characterRating.minTotalScore
                : `${characterRating.minTotalScore} - ${characterRating.maxTotalScore}`}
            </span>
          </Badge>
          <div className="flex flex-wrap">
            {characterRating.character.map((character, index) => (
              <div key={index}>
                <Badge className="flex flex-row items-center">
                  <img src={CharactersData[character].icon} alt="character" className="h-6 w-6 rounded-full" />
                  {CharactersData[character].name}
                </Badge>
              </div>
            ))}
          </div>
        </TooltipTrigger>

        <TooltipContent>
          <div className="flex flex-col gap-2">
            {Object.keys(characterRating.valuableSub).map(subStat => (
              <div key={subStat} className="flex items-center justify-center gap-2 font-semibold">
                {subStat}: {characterRating.valuableSub[subStat].score}
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
