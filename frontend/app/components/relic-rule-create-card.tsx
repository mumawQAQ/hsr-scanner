'use client';
import { Card, CardBody } from '@nextui-org/card';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useCreateRelicRule } from '@/app/apis/relic-template';

export type RelicRuleCreateCardProps = {
  templateId: string;
};

export default function RelicRuleCreateCard({ templateId }: RelicRuleCreateCardProps) {
  const { mutate: createRule } = useCreateRelicRule();

  const handleCreateRule = () => {
    // generate a random rule id
    const ruleId = uuidv4();
    createRule({ template_id: templateId, rule_id: ruleId });
  };

  return (
    <Card className="min-h-[15rem] w-full" shadow="sm" isPressable onPress={handleCreateRule}>
      <CardBody className="flex items-center justify-center">
        <Plus />
      </CardBody>
    </Card>
  );
}
