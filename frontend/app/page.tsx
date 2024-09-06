'use client';

import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Start the backend and set up listeners
    const startAndListen = async () => {
      try {
        const statusUnlistener = await listen('requirements-status-log', event => {
          console.log('requirement install status:', event.payload);
        });

        // Listen for 'backend-log' events
        const logUnlistener = await listen('requirements-install-log', event => {
          console.log('requirement log:', event.payload);
        });

        // Listen for 'backend-error' events
        const errorUnlistener = await listen('requirements-install-error', event => {
          console.error('requirement error:', event.payload);
        });

        await invoke('install_python_requirements'); // Start the backend process

        // Return cleanup function to remove event listeners
        return () => {
          statusUnlistener();
          logUnlistener();
          errorUnlistener();
        };
      } catch (e) {
        console.error('Error install requirement:', e);
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
  }, []);

  // useEffect(() => {
  //   // Start the backend and set up listeners
  //   const startAndListen = async () => {
  //     try {
  //       await invoke('start_backend'); // Start the backend process
  //       console.log('Backend started successfully.');
  //
  //       // Listen for 'backend-log' events
  //       const logUnlistener = await listen('backend-log', event => {
  //         console.log('Log from backend:', event.payload);
  //       });
  //
  //       // Listen for 'backend-error' events
  //       const errorUnlistener = await listen('backend-port', event => {
  //         console.error('backend port is:', event.payload);
  //       });
  //
  //       // Return cleanup function to remove event listeners
  //       return () => {
  //         logUnlistener();
  //         errorUnlistener();
  //       };
  //     } catch (e) {
  //       console.error('Error starting backend or setting up listeners:', e);
  //     }
  //   };
  //
  //   // Call the async function and handle cleanup
  //   let cleanupFunc = () => {}; // Initialize cleanup function
  //   startAndListen().then(cleanup => {
  //     if (cleanup) cleanupFunc = cleanup;
  //   });
  //
  //   // Cleanup listeners when component unmounts
  //   return () => {
  //     cleanupFunc();
  //   };
  // }, []);
  return <div></div>;
}
