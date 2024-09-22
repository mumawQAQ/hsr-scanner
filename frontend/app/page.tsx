'use client';

import { useEffect } from 'react';
import { useModal } from '@/app/hooks/use-modal-store';
import { Spinner } from '@nextui-org/react';
import useBackendClientStore from '@/app/hooks/use-backend-client-store';
import { useRouter } from 'next/navigation';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import toast from 'react-hot-toast';
import { usePath } from '@/app/hooks/use-path-store';

export default function Home() {
  const { onOpen } = useModal();
  const { setPath } = usePath();
  const { requirementFulfilled, setBackendPort } = useBackendClientStore();
  const router = useRouter();

  const { backendPort } = useBackendClientStore();

  useEffect(() => {
    onOpen('install-requirement');
  }, []);

  useEffect(() => {
    if (requirementFulfilled) {
      // Start the backend and set up listeners
      const startAndListen = async () => {
        try {
          console.log('Starting backend and setting up listeners...');
          // Listen for 'backend-log' events
          const logUnlistener = await listen('backend-log', event => {
            console.log('Log from backend:', event.payload);
          });

          // Listen for 'backend-error' events
          const errorUnlistener = await listen<string>('backend-port', event => {
            setBackendPort(parseInt(event.payload));
          });

          await invoke('start_backend'); // Start the backend process

          // Return cleanup function to remove event listeners
          return () => {
            logUnlistener();
            errorUnlistener();
          };
        } catch (e) {
          console.error('Error starting backend or setting up listeners:', e);
          toast.error('启动后端服务时出错，请向作者反馈此问题');
        }
      };

      // Call the async function and handle cleanup
      let cleanupFunc = () => {}; // Initialize cleanup function
      startAndListen().then(cleanup => {
        if (cleanup) cleanupFunc = cleanup;
      });

      // Cleanup listeners when component unmounts
      return () => {
        cleanupFunc();
      };
    }
  }, [requirementFulfilled]);

  useEffect(() => {
    if (backendPort) {
      router.push('/dashboard/relic-panel');
      setPath('/dashboard/relic-panel');
    }
  }, [backendPort]);

  return (
    <div className="flex h-screen items-center justify-center">
      {!backendPort && (
        <div className="flex flex-col">
          <Spinner size="lg" className="my-4" />
          <div>正在启动后端服务，如果是第一次启动，会比较慢，请稍等....</div>
        </div>
      )}
    </div>
  );
}
