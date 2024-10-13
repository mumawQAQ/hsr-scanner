'use client';
import { Card, CardBody } from '@nextui-org/card';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useCreateRelicRule, useRelicTemplateList } from '@/app/apis/relic-template';
import toast from 'react-hot-toast';

export type RelicRuleCreateCardProps = {
  templateId: string;
};

export default function RelicRuleCreateCard({ templateId }: RelicRuleCreateCardProps) {
  const { mutate: createRule } = useCreateRelicRule();
  const { data: templateList } = useRelicTemplateList();

  const handleCreateRule = () => {
    // if the current template is in use, do not create a new rule
    if (templateList?.find(template => template.id === templateId)?.in_use) {
      toast.error('请先停用当前模板以创建新规则！');
      return;
    }

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
