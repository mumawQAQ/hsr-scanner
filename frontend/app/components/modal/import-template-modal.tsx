import { useModal } from '@/app/hooks/use-modal-store';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { useImportTemplate } from '@/app/apis/relic-template';
import toast from 'react-hot-toast';
import { Textarea } from '@nextui-org/input';
import { useState } from 'react';

export const ImportTemplateModal = () => {
  const [templateCode, setTemplateCode] = useState<string>('');
  const { isOpen, onClose, onOpen, type } = useModal();
  const importTemplate = useImportTemplate();
  const isModalOpen = isOpen && type === 'import-template';

  const handleImportTemplateCode = () => {
    if (!templateCode) {
      return;
    }
    importTemplate.mutate(templateCode, {
      onSuccess: () => {
        onOpen('select-template');
      },
      onError: () => {
        toast.error('导入模板失败，请检查模板代码是否正确, 检查是否是最新资源, 或联系作者反馈');
      },
    });
  };

  return (
    <Modal isOpen={isModalOpen} onClose={onClose}>
      <ModalContent className="flex items-center justify-center p-6">
        <ModalHeader>请输入模板代码以导入模板</ModalHeader>
        <ModalBody className="flex">
          <Textarea
            maxRows={2}
            label="模板代码"
            value={templateCode}
            onValueChange={setTemplateCode}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleImportTemplateCode} color="default" variant="bordered">导入代码</Button>
          <Button onClick={onClose} color="default" variant="bordered">关闭</Button>
        </ModalFooter>
      </ModalContent>

    </Modal>
  );
};