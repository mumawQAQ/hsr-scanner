import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

import { Card } from '@/components/ui/card.tsx';
import useRelicTemplateStore from '@/hooks/use-relic-template-store.ts';

interface RelicRuleEmptyCardProps {
  templateId: string;
}

const RelicRuleEmptyCard = ({ templateId }: RelicRuleEmptyCardProps) => {
  const { createRelicRatingRule } = useRelicTemplateStore();

  const handleCreateNewRule = async () => {
    // generate a new rule id
    const ruleId = uuidv4();
    const result = await createRelicRatingRule(templateId, ruleId, {
      setNames: [],
      partNames: {},
      valuableSub: [],
      fitCharacters: [],
    });
    if (!result.success) {
      toast(result.message, { type: 'error' });
    }
  };

  return (
    <Card
      className="flex h-fit cursor-pointer flex-col items-center justify-center py-20 hover:ring-1 hover:ring-offset-2"
      onClick={handleCreateNewRule}
    >
      <div>添加新规则</div>
      <div>
        <Plus />
      </div>
    </Card>
  );
};

export default RelicRuleEmptyCard;
