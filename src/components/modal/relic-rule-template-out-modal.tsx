import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store.ts';

const RelicRuleTemplateOutModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === 'export-relic-rules-template';

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">导入遗器筛选条件</DialogTitle>
        </DialogHeader>

        <img src={data.qrCode} alt="QR Code" className="mx-auto" />

        <DialogFooter className="flex flex-row bg-gray-100 px-6 py-4">
          共享此二维码给其他人，他们可以通过扫描此二维码导入遗器筛选条件。
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RelicRuleTemplateOutModal;
