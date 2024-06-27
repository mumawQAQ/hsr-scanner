import { toast } from 'react-toastify';

import { RelicRulesTemplate } from '../../types.ts';

import { Button } from '@/components/ui/button.tsx';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { useModal } from '@/hooks/use-modal-store.ts';
import useRelicStore from '@/hooks/use-relic-store.ts';
import useRelicTemplateStore from '@/hooks/use-relic-template-store.ts';
import relicRatingUtils from '@/utils/relicRatingUtils.ts';

const RelicRuleTemplateInModal = () => {
  const { isOpen, onClose, type, onOpen } = useModal();
  const { removeRelicRulesTemplate, relicRulesTemplateStore } = useRelicTemplateStore();

  const { relicTitle, mainRelicStats } = useRelicStore();

  const isModalOpen = isOpen && type === 'import-relic-rules-template';

  const handleImportRelicRulesTemplate = async (template: RelicRulesTemplate) => {
    if (!relicTitle || !mainRelicStats) {
      toast('请先选择遗器', { type: 'error' });
      return;
    }
    const result = await relicRatingUtils.checkRelicRatingValuableMainAndSet(relicTitle, mainRelicStats.name);

    if (!result.success) {
      toast(result.message, { type: 'error' });
      return;
    }

    // if the template have valuableSub, override the valuableSub
    if (template.valuableSub) {
      const result = await relicRatingUtils.updateRelicRatingValuableSub(
        relicTitle,
        mainRelicStats.name,
        template.valuableSub
      );

      if (!result.success) {
        toast(`导入失败, ${result.message}`, { type: 'error' });
        return;
      }
    }

    // if the template have should lock, override the should lock
    if (template.shouldLock) {
      const result = await relicRatingUtils.updateRelicRatingShouldLock(
        relicTitle,
        mainRelicStats.name,
        template.shouldLock
      );

      if (!result.success) {
        toast(`导入失败, ${result.message}`, { type: 'error' });
        return;
      }
    }

    toast('导入成功', { type: 'success' });
    onClose();
  };

  const handleDeleteRulesTemplate = async (templateId: string) => {
    const result = await removeRelicRulesTemplate(templateId);
    if (result.success) {
      toast('删除成功', { type: 'success' });
    } else {
      toast('删除失败', { type: 'error' });
    }
  };

  const handleCreateNewTemplate = () => {
    onOpen('create-relic-rules-template');
  };

  const handleImportTemplate = () => {
    console.log('import template');
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">导入遗器筛选条件</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] p-6">
          <div className="mb-2 text-center font-semibold">储存的模板</div>
          {relicRulesTemplateStore &&
            Object.keys(relicRulesTemplateStore).map(templateId => {
              const template = relicRulesTemplateStore[templateId];
              return (
                <div
                  key={templateId}
                  className="my-2 flex flex-row items-center justify-between rounded border-2 p-2 hover:border-gray-700"
                >
                  <div className="font-black">{template.name}</div>
                  <div className="space-x-2">
                    <Button size="sm" onClick={() => handleImportRelicRulesTemplate(template)}>
                      导入
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteRulesTemplate(templateId)}>
                      删除
                    </Button>
                  </div>
                </div>
              );
            })}
          {(!relicRulesTemplateStore || Object.keys(relicRulesTemplateStore).length === 0) && (
            <div className="my-2 rounded border-2 p-2 text-center font-black">暂无模板, 请先创建或导入模板</div>
          )}
        </ScrollArea>

        <DialogFooter className="flex flex-row bg-gray-100 px-6 py-4">
          <Button variant="primary" onClick={handleCreateNewTemplate}>
            创建新模板
          </Button>
          <Button variant="primary" onClick={handleImportTemplate}>
            导入模板
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RelicRuleTemplateInModal;
