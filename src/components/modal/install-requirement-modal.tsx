import { LogViewer } from '@patternfly/react-log-viewer';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store.ts';

const InstallRequirementModal = () => {
  const { isOpen, onClose, type } = useModal();
  const [logQueue, setLogQueue] = useState<string[]>([]);

  const isModalOpen = isOpen && type === 'install-requirement';

  useEffect(() => {
    (window as any).ipcRenderer.on('finish-install-requirement-message', (_: any, state: boolean) => {
      if (state) {
        toast('依赖安装完成', { type: 'default' });
        onClose();
      } else {
        toast('依赖安装失败, 请向作者反馈此错误', { type: 'error' });
        setLogQueue(prevState => [...prevState, '依赖安装失败, 请向作者反馈此错误']);
      }
    });
  }, []);

  useEffect(() => {
    (window as any).ipcRenderer.on('install-requirement-message', (_: any, message: string) => {
      setLogQueue(prev => {
        return [...prev, message];
      });
    });
  }, []);

  return (
    <Dialog open={isModalOpen}>
      <DialogContent className="flex h-[700px] w-[500px] flex-col items-center justify-center bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">正在安装必要依赖，请勿关闭此窗口</DialogTitle>
        </DialogHeader>
        <LogViewer height={600} width={450} isTextWrapped={true} data={logQueue} hasLineNumbers={false} />
      </DialogContent>
    </Dialog>
  );
};

export default InstallRequirementModal;
