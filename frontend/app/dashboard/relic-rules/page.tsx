'use client';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@nextui-org/button';
import { usePath } from '@/app/hooks/use-path-store';
import RelicRuleCreateCard from '@/app/components/relic-rule-create-card';
import {
  useDeleteTemplate,
  useExportTemplate,
  useRelicRuleList,
  useRelicTemplateList,
  useSelectTemplate,
  useUnselectTemplate,
} from '@/app/apis/relic-template';
import { Spinner } from '@nextui-org/react';
import RelicRuleCard from '@/app/components/relic-rule-card';
import { useEffect } from 'react';
import { useNavbarStore } from '@/app/hooks/use-navbar-store';
import toast from 'react-hot-toast';
import { useModal } from '@/app/hooks/use-modal-store';

export default function RelicRules() {
  const router = useRouter();
  const { onOpen } = useModal();
  const { viewTemplateId: templateId } = usePath();
  const { setRightNavbar, setLeftNavbar, clearCustomNavbar } = useNavbarStore();
  const exportTemplate = useExportTemplate();
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

    const handleExportTemplate = () => {
      exportTemplate.mutate(templateId ?? '', {
        onSuccess: (data) => {
          onOpen('export-template', { qrCodeData: data });
        },
        onError: e => {
          toast.error(`导出失败, 请重试, ${e.message}`);
        },
      });
    };

    const leftNavBar = <ChevronLeft size={32} className="cursor-pointer" onClick={handleBack} />;
    const rightNavBar = (
      <div className="flex gap-2">
        {/*// if the current used template is the same as the selected template, disable the button*/}
        {templateList?.find(template => template.id === templateId)?.in_use ? (
          <Button size="sm" variant="bordered" color="danger" onPress={handleUnselectTemplate}>
            停用
          </Button>
        ) : (
          <Button size="sm" variant="bordered" color="default" onPress={handleSelectTemplate}>
            启用
          </Button>
        )}
        <Button size="sm" variant="bordered" color="default" onPress={handleExportTemplate}>
          导出
        </Button>
        <Button size="sm" variant="bordered" color="danger" onPress={handleDeleteTemplate}>
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
