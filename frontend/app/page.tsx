'use client';

import { useEffect, useState } from 'react';
import { useModal } from '@/app/hooks/use-modal-store';
import { Spinner } from '@nextui-org/react';
import useBackendClientStore from '@/app/hooks/use-backend-client-store';
import { useRouter } from 'next/navigation';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import toast from 'react-hot-toast';
import { usePath } from '@/app/hooks/use-path-store';
import { useJsonFile } from '@/app/apis/files';
import { useRelicTemplateList } from '@/app/apis/relic-template';
import ClientLogViewer from '@/app/components/client-logviewer';


export default function Home() {
  const { onOpen } = useModal();
  const { setPath } = usePath();
  const [logQueue, setLogQueue] = useState<string[]>([]);
  const router = useRouter();
  const relicSets = useJsonFile('relic/relic_sets.json');
  const characters = useJsonFile('character/character_meta.json');
  const relicTemplateList = useRelicTemplateList();

  const {
    requirementFulfilled,
    setBackendPort,
    backendPort,
    apiInitialized,
  } = useBackendClientStore();

  useEffect(() => {
    const installRequirement = async () => {
      await invoke('post_backup').catch((e) => {
        console.error('Failed to restore backup file:', e);
      });
      onOpen('install-requirement');
    };

    installRequirement();
  }, []);

  useEffect(() => {
    if (apiInitialized) {
      // refresh relic sets and characters
      relicSets.refetch();
      characters.refetch();

      relicTemplateList.refetch();
    }
  }, [apiInitialized]);

  useEffect(() => {
    if (requirementFulfilled) {
      // Start the backend and set up listeners
      const startAndListen = async () => {
        try {
          console.log('Starting backend and setting up listeners...');
          // Listen for 'backend-log' events
          const logUnlistener = await listen<string>('backend-log', event => {
            setLogQueue(prevState => [...prevState, event.payload]);
          });

          // Listen for 'backend-error' events
          const errorUnlistener = await listen<string>('backend-error', event => {
            setLogQueue(prevState => [...prevState, event.payload]);
          });


          // Listen for 'backend-port' events
          const portUnlistener = await listen<string>('backend-port', event => {
            setBackendPort(parseInt(event.payload));
          });

          await invoke('start_backend'); // Start the backend process

          // Return cleanup function to remove event listeners
          return () => {
            logUnlistener();
            errorUnlistener();
            portUnlistener();
          };
        } catch (e) {
          console.error('Error starting backend or setting up listeners:', e);
          toast.error('启动后端服务时出错，请向作者反馈此问题');
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
        <div>

          <div>
            <ClientLogViewer height={400} width={450} isTextWrapped={true} data={logQueue} hasLineNumbers={false} />
          </div>
          <div className="flex flex-col">
            <Spinner size="lg" className="my-4" />
            <div className="text-center">正在启动后端服务，请稍等....</div>
          </div>
        </div>
      )}
    </div>
  );
}
