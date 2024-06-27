import { Plus } from 'lucide-react';

import { Card } from '@/components/ui/card.tsx';

const RelicRuleEmptyCard = () => {
  return (
    <Card className="flex h-fit cursor-pointer flex-col items-center justify-center py-20 hover:ring-1 hover:ring-offset-2">
      <div>添加新规则</div>
      <div>
        <Plus />
      </div>
    </Card>
  );
};

export default RelicRuleEmptyCard;
