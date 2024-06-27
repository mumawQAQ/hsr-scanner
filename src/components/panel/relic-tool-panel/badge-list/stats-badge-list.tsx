import { Badge } from '@/components/ui/badge.tsx';

interface StatsBadgeListProps {
  partName?: string;
  stats: string[];
}

const StatsBadgeList = ({ partName, stats }: StatsBadgeListProps) => {
  if (!stats) {
    return null;
  }

  return (
    <div>
      {partName && stats.length > 0 && <div className="text-center font-semibold">{partName}</div>}
      {stats.map((stat, index) => (
        <Badge key={index} className="mr-2 inline-flex flex-row items-center gap-1">
          {stat}
        </Badge>
      ))}
    </div>
  );
};

export default StatsBadgeList;
