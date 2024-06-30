import { useRef } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store.ts';
import useRelicTemplateStore from '@/hooks/use-relic-template-store.ts';

const ImportRelicTemplateModal = () => {
  const { createOrUpdateRelicRatingRulesTemplate } = useRelicTemplateStore();
  const { isOpen, onClose, type } = useModal();
  const inputRef = useRef<HTMLInputElement>(null);

  const isModalOpen = isOpen && type === 'import-template-model';

  const handleClose = () => {
    onClose();
  };

  const handleRelicTemplate = () => {
    if (inputRef.current?.files) {
      const file = inputRef.current.files[0];
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          if (typeof reader.result !== 'string') {
            toast('文件读取错误，非法文件内容', { type: 'error' });
            return;
          }
          const templateFile = reader.result;
          const template = JSON.parse(templateFile);

          // create a new template id
          const templateId = uuidv4();
          await createOrUpdateRelicRatingRulesTemplate(templateId, template);

          toast('成功导入遗器配置', { type: 'success' });
          handleClose();
        } catch (error) {
          console.error('Failed to import relic template:', error);
          toast('导入遗器配置失败', { type: 'error' });
        }
      };

      reader.onerror = () => {
        toast('文件读取错误', { type: 'error' });
      };

      reader.readAsText(file); // Change here to read as text
    } else {
      toast('没有文件被选择', { type: 'error' });
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">导入配置文件</DialogTitle>
        </DialogHeader>

        <div className="text-center">
          <input type="file" ref={inputRef} accept=".json" onChange={handleRelicTemplate} />
        </div>

        <DialogFooter className="flex flex-row bg-gray-100 px-6 py-4">上传配置文件导入遗器配置</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportRelicTemplateModal;
