import { useModal } from '@/app/hooks/use-modal-store';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import DragAndDrop from '@/app/components/drag-and-drop';
import { useImportTemplate } from '@/app/apis/relic-template';
import toast from 'react-hot-toast';

export const ImportTemplateModal = () => {
  const { isOpen, onClose, onOpen, type } = useModal();
  const importTemplate = useImportTemplate();
  const isModalOpen = isOpen && type === 'import-template';

  const handleQrCodeData = (data: string | null) => {
    if (!data) {
      return;
    }
    importTemplate.mutate(data, {
      onSuccess: () => {
        onOpen('select-template');
      },
      onError: () => {
        toast.error('导入模板失败，请检查二维码是否正确, 或联系作者反馈');
      },
    });

  };

  return (
    <Modal isOpen={isModalOpen} onClose={onClose}>
      <ModalContent className="flex items-center justify-center p-6">
        <ModalHeader>请上传二维码以导入模板</ModalHeader>
        <ModalBody>
          <DragAndDrop onQRCodeData={handleQrCodeData} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} color="default" variant="bordered">关闭</Button>
        </ModalFooter>
      </ModalContent>

    </Modal>
  );
};