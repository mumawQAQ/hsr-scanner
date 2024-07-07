import { Badge } from '@/components/ui/badge.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Slider } from '@/components/ui/slider.tsx';
import { ValuableSubStatsV2 } from '@/type/types.ts';

interface StatsBadgeListProps {
  partName?: string;
  stats: string[] | ValuableSubStatsV2[];
  handleSubScaleChange?: (oldSubStats: ValuableSubStatsV2, newScale: number) => void;
}

const StatsBadgeList = ({ partName, stats, handleSubScaleChange }: StatsBadgeListProps) => {
  if (!stats) {
    return null;
  }

  return (
    <div>
      {partName && stats.length > 0 && <div className="text-center font-semibold">{partName}</div>}
      {stats.map((stat, index) =>
        typeof stat === 'string' ? (
          <Badge key={index} className="mr-2 inline-flex flex-row items-center gap-1">
            {stat}
          </Badge>
        ) : (
          <div className="flex flex-grow flex-row items-center gap-2">
            <Badge key={index} className="my-2">
              {stat.subStat}
            </Badge>
            <div className="flex items-center gap-2">
              <Label className="text-nowrap">权重:</Label>
              <Slider
                max={1}
                min={0}
                step={0.05}
                defaultValue={[stat.ratingScale]}
                onValueChange={value => {
                  if (handleSubScaleChange) {
                    handleSubScaleChange(stat, value[0]);
                  }
                }}
                className={'w-20'}
              />
              <div>{stat.ratingScale.toFixed(2)}</div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default StatsBadgeList;
