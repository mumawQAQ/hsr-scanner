import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { useModal } from '@/hooks/use-modal-store.ts';

export const UpdateProvider = () => {
  const { onOpen } = useModal();
  useEffect(() => {
    window.ipcRenderer.on('update-available', (_: any, message: string) => {
      onOpen('update-modal', { updateMessage: message });
    });
  }, [onOpen]);
  useEffect(() => {
    const handleMessage = (_: any, message: string) => {
      console.log('Received message:', message);
      toast(message); // Show toast notification
    };

    window.ipcRenderer.on('message', handleMessage);
  }, []);

  return null;
};
