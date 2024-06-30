import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button.tsx';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store.ts';

const UpdateModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === 'update-modal';

  const handleClose = () => {
    onClose();
  };

  const handleUpdate = async () => {
    console.log('update now');
    const result = await (window as any).ipcRenderer.updateNow();
    if (result.success) {
      toast('正在更新....', { type: 'success' });
      handleClose();
    } else {
      toast(`更新失败 ${result.message}`, { type: 'error' });
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">导入配置文件</DialogTitle>
        </DialogHeader>

        <div className="text-center">{data.updateMessage}，请点击下方按钮进行更新</div>

        <DialogFooter className="flex flex-row bg-gray-100 px-6 py-4">
          <Button onClick={handleUpdate}>更新</Button>
          <Button onClick={handleClose}>取消</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateModal;
