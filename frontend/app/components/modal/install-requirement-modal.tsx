'use client';
import { LogViewer } from '@patternfly/react-log-viewer';
import { useEffect, useState } from 'react';
import { useModal } from '@/app/hooks/use-modal-store';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';
import toast from 'react-hot-toast';
import useBackendClientStore from '@/app/hooks/use-backend-client-store';

const InstallRequirementModal = () => {
  const { isOpen, onClose, type } = useModal();
  const { setRequirementFulfilled } = useBackendClientStore();
  const [logQueue, setLogQueue] = useState<string[]>([]);

  const isModalOpen = isOpen && type === 'install-requirement';

  useEffect(() => {
    // Start the backend and set up listeners
    const startAndListen = async () => {
      try {
        const successUnlistener = await listen<string>('requirements-status-success', () => {
          toast.success('必要依赖安装成功');
          setRequirementFulfilled(true);
          onClose();
        });
        const failureUnlistener = await listen<string>('requirements-status-failure', () => {
          toast.error('必要依赖安装失败，请联系作者反馈此问题');
        });

        const statusUnlistener = await listen<string>('requirements-status-log', event => {
          setLogQueue(prevState => [...prevState, event.payload]);
        });

        // Listen for 'backend-log' events
        const logUnlistener = await listen<string>('requirements-install-log', event => {
          setLogQueue(prevState => [...prevState, event.payload]);
        });

        // Listen for 'backend-error' events
        const errorUnlistener = await listen<string>('requirements-install-error', event => {
          setLogQueue(prevState => [...prevState, event.payload]);
        });

        await invoke('install_python_requirements'); // Start the backend process

        // Return cleanup function to remove event listeners
        return () => {
          successUnlistener();
          failureUnlistener();
          statusUnlistener();
          logUnlistener();
          errorUnlistener();
        };
      } catch (e) {
        toast.error('安装必要依赖时出错，请右键打开控制台，查看详细错误信息');
        console.error('Error install requirement:', e);
      }
    };

    // Call the async function and handle cleanup
    let cleanupFunc = () => {
    }; // Initialize cleanup function
    startAndListen().then(cleanup => {
      if (cleanup) cleanupFunc = cleanup;
    });

    // Cleanup listeners when component unmounts
    return () => {
      cleanupFunc();
    };
  }, []);

  return (
    <Modal isOpen={isModalOpen} size="xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">正在安装必要依赖，请勿关闭此窗口</ModalHeader>
        <ModalBody className="mx-auto">
          <LogViewer height={400} width={450} isTextWrapped={true} data={logQueue} hasLineNumbers={false} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InstallRequirementModal;
