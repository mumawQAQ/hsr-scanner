import { useModal } from '@/app/hooks/use-modal-store';
import { Button } from '@nextui-org/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { QRCodeSVG } from 'qrcode.react';


export const ExportTemplateModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === 'export-template';
  if (!data.qrCodeData) {
    return null;
  }

  return (
    <Modal isOpen={isModalOpen} onClose={onClose}>
      <ModalContent className="flex items-center justify-center p-6">
        <ModalHeader>请保存二维码</ModalHeader>
        <ModalBody>
          <QRCodeSVG value={data.qrCodeData ?? ''} size={300} />
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} color="default" variant="bordered">关闭</Button>
        </ModalFooter>
      </ModalContent>

    </Modal>
  );
};