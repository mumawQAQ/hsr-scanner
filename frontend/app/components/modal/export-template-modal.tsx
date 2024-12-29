import { useModal } from '@/app/hooks/use-modal-store';
import { Button } from '@nextui-org/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { Textarea } from '@nextui-org/input';


export const ExportTemplateModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === 'export-template';
  if (!data.qrCodeData) {
    return null;
  }

  return (
    <Modal isOpen={isModalOpen} onClose={onClose}>
      <ModalContent className="flex items-center justify-center p-6">
        <ModalHeader>请保存模板代码</ModalHeader>
        <ModalBody>
          <Textarea maxRows={2} label="模板代码 (ctrl+a)全选以后复制" value={data.qrCodeData} />
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} color="default" variant="bordered">关闭</Button>
        </ModalFooter>
      </ModalContent>

    </Modal>
  );
};