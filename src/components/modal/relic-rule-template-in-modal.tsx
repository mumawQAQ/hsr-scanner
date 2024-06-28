import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button.tsx';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { useModal } from '@/hooks/use-modal-store.ts';
import useRelicTemplateStore from '@/hooks/use-relic-template-store.ts';
import { RatingTemplate } from '@/type/types.ts';

const RelicRuleTemplateInModal = () => {
  const { isOpen, onClose, type, onOpen } = useModal();
  const { removeRelicRatingRulesTemplate, relicRatingRulesTemplateStore, setCurrentRelicRatingRulesTemplate } =
    useRelicTemplateStore();

  const isModalOpen = isOpen && type === 'import-relic-rules-template';

  const handleUseTemplate = async (template: RatingTemplate) => {
    setCurrentRelicRatingRulesTemplate(template);
    toast('已成功使用模板', { type: 'success' });
  };

  const handleDeleteRulesTemplate = async (templateId: string) => {
    const result = await removeRelicRatingRulesTemplate(templateId);
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
    onOpen('import-qr-code-model');
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
          {relicRatingRulesTemplateStore &&
            Object.keys(relicRatingRulesTemplateStore).map(templateId => {
              const template = relicRatingRulesTemplateStore[templateId];
              return (
                <div
                  key={templateId}
                  className="my-2 flex flex-row items-center justify-between rounded border-2 p-2 hover:border-gray-700"
                >
                  <div>
                    <span className="font-black">{template.templateName}</span>
                    <span className="text-sm text-gray-600"> by {template.author}</span>
                  </div>
                  <div className="space-x-2">
                    <Button size="sm" onClick={() => handleUseTemplate(template)}>
                      使用
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteRulesTemplate(templateId)}>
                      删除
                    </Button>
                  </div>
                </div>
              );
            })}
          {(!relicRatingRulesTemplateStore || Object.keys(relicRatingRulesTemplateStore).length === 0) && (
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
