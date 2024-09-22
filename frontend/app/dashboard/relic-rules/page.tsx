'use client';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@nextui-org/button';
import { usePath } from '@/app/hooks/use-path-store';
import RelicRuleCreateCard from '@/app/components/relic-rule-create-card';
import { useRelicRuleList, useSelectTemplate } from '@/app/apis/relic-template';
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

  useEffect(() => {
    const handleBack = () => {
      router.back();
      clearCustomNavbar();
    };
    const handleSelectTemplate = () => {
      selectTemplate(templateId ?? '');
      router.back();
      clearCustomNavbar();
    };
    const leftNavBar = <ChevronLeft size={32} className="cursor-pointer" onClick={handleBack} />;
    const rightNavBar = (
      <Button size="md" variant="bordered" color="default" onPress={handleSelectTemplate}>
        选择
      </Button>
    );

    setRightNavbar(rightNavBar);
    setLeftNavbar(leftNavBar);
  }, [templateId]);

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
      <div className="flex flex-col gap-2">
        {rules.map(rule => (
          <RelicRuleCard key={rule.id} ruleId={rule.id} characters={rule.fitCharacters} />
        ))}

        <RelicRuleCreateCard templateId={templateId} />
      </div>
    </div>
  );
}
