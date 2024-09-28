'use client';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@nextui-org/button';
import { usePath } from '@/app/hooks/use-path-store';
import RelicRuleCreateCard from '@/app/components/relic-rule-create-card';
import {
  useDeleteTemplate,
  useRelicRuleList,
  useRelicTemplateList,
  useSelectTemplate,
  useUnselectTemplate,
} from '@/app/apis/relic-template';
import { Spinner } from '@nextui-org/react';
import RelicRuleCard from '@/app/components/relic-rule-card';
import { useEffect } from 'react';
import { useNavbarStore } from '@/app/hooks/use-navbar-store';

export default function RelicRules() {
  const router = useRouter();
  const { viewTemplateId: templateId } = usePath();
  const { setRightNavbar, setLeftNavbar, clearCustomNavbar } = useNavbarStore();
  const { data: rules, error, isLoading } = useRelicRuleList(templateId);
  const { mutate: selectTemplate } = useSelectTemplate();
  const { mutate: unselectTemplate } = useUnselectTemplate();
  const { mutate: deleteTemplate } = useDeleteTemplate();
  const { data: templateList } = useRelicTemplateList();

  useEffect(() => {
    const handleBack = () => {
      router.back();
      clearCustomNavbar();
    };

    const handleSelectTemplate = () => {
      selectTemplate(templateId ?? '');
    };

    const handleUnselectTemplate = () => {
      unselectTemplate(templateId ?? '');
    };

    const handleDeleteTemplate = () => {
      deleteTemplate(templateId ?? '');
      handleBack();
    };

    const leftNavBar = <ChevronLeft size={32} className="cursor-pointer" onClick={handleBack} />;
    const rightNavBar = (
      <div className="flex gap-2">
        {/*// if the current used template is the same as the selected template, disable the button*/}
        {templateList?.find(template => template.id === templateId)?.in_use ? (
          <Button size="md" variant="bordered" color="danger" onPress={handleUnselectTemplate}>
            停用
          </Button>
        ) : (
          <Button size="md" variant="bordered" color="default" onPress={handleSelectTemplate}>
            启用
          </Button>
        )}
        <Button size="md" variant="bordered" color="danger" onPress={handleDeleteTemplate}>
          删除
        </Button>
      </div>
    );

    setRightNavbar(rightNavBar);
    setLeftNavbar(leftNavBar);
  }, [templateId, templateList]);

  if (!templateId) {
    return <div>Invalid Template ID</div>;
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (error || !rules) {
    return <div>Error loading rules</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {rules.map(rule => (
          <RelicRuleCard key={rule.id} templateId={templateId} ruleId={rule.id} />
        ))}

        <RelicRuleCreateCard templateId={templateId} />
      </div>
    </div>
  );
}
