import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { useModal } from '@/hooks/use-modal-store.ts';
import useWebclientStore from '@/hooks/use-webclient-store.ts';

export const BackendProvider = () => {
  const { onOpen } = useModal();
  useEffect(() => {
    (window as any).ipcRenderer.on('start-backend-message', () => {
      toast('正在启动后端服务', { type: 'info' });
    });
    (window as any).ipcRenderer.on('backend-port', (_: any, port: number) => {
      toast(`后端服务已启动，端口号: ${port}`, { type: 'success' });
      useWebclientStore.getState().setBackendPort(port);
    });
  }, []);

  useEffect(() => {
    (window as any).ipcRenderer.on('start-install-requirement-message', () => {
      onOpen('install-requirement');
    });
  }, []);

  return null;
};
