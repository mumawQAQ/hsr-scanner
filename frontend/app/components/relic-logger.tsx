import React, { useEffect, useRef, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import { LogViewer as PrettyLogViewer } from '@patternfly/react-log-viewer/dist/js/LogViewer/LogViewer';
import useWindowStore from '@/app/hooks/use-window-store';

export default function RelicLogger() {
  const { logPause: isPaused } = useWindowStore();
  const [logQueue, setLogQueue] = useState<string[]>([]);
  const logViewerRef = useRef();

  useEffect(() => {
    if (isPaused) {
      if (logViewerRef.current) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        logViewerRef.current.scrollToBottom();
      }
    }
  }, [logQueue, isPaused]);

  useEffect(() => {
    // Start the backend and set up listeners
    const listenLogs = async () => {
      const logUnlistener = await listen<string>('backend-log', event => {
        setLogQueue(prev => {
          // max 1000 lines
          if (prev.length >= 1000) {
            return [...prev.slice(1), event.payload];
          }
          return [...prev, event.payload];
        });
      });

      // Return cleanup function to remove event listeners
      return () => {
        logUnlistener();
      };
    };

    let cleanupFunc = () => {};
    listenLogs().then(cleanup => {
      if (cleanup) cleanupFunc = cleanup;
    });

    // Cleanup listeners when component unmounts
    return () => {
      cleanupFunc();
    };
  }, []);
  return (
    <div className="h-[200px] w-[200px]">
      <PrettyLogViewer innerRef={logViewerRef} data={logQueue} hasLineNumbers={false} isTextWrapped={true} />
    </div>
  );
}
