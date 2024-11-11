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
import { useJsonFile } from '@/app/apis/files';
import { useRelicTemplateList } from '@/app/apis/relic-template';


export default function Home() {
  const { onOpen } = useModal();
  const { setPath } = usePath();
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Ctrl + Shift + I is pressed
      if (
        event.ctrlKey &&
        event.shiftKey &&
        (event.key === 'I' || event.key === 'i')
      ) {
        event.preventDefault(); // Prevent default browser behavior if any

        // Invoke the Rust command to open developer tools
        invoke('open_browser_console')
          .then(() => {
            console.log('Developer tools opened successfully.');
          })
          .catch((error) => {
            console.error('Failed to open developer tools:', error);
          });
      }
    };

    // Attach the event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      {!backendPort && (
        <div className="flex flex-col">
          <Spinner size="lg" className="my-4" />
          <div>正在启动后端服务，请稍等....</div>
        </div>
      )}
    </div>
  );
}
