import { LogViewer as PrettyLogViewer } from '@patternfly/react-log-viewer';
import React, { useEffect, useState } from 'react';

import { Label } from '@/components/ui/label.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import useWebclientStore from '@/hooks/use-webclient-store.ts';

const LogViewer = () => {
  const { patch } = useWebclientStore();

  const [showAllLevel, setShowAllLevel] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [logQueue, setLogQueue] = useState<string[]>([]);
  const logViewerRef = React.useRef();

  useEffect(() => {
    window.ipcRenderer.on('backend-log', (_, data: string) => {
      setLogQueue(prev => {
        // max 1000 lines
        if (prev.length >= 1000) {
          return [...prev.slice(1), data];
        }
        return [...prev, data];
      });
    });
  }, []);

  useEffect(() => {
    if (isPaused) {
      if (logViewerRef.current) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        logViewerRef.current.scrollToBottom();
      }
    }
  }, [logQueue, isPaused]);

  const handleLogLevelChange = async (state: boolean) => {
    await patch('log-level', state ? 'DEBUG' : 'ERROR');
    setShowAllLevel(state);
  };

  return (
    <div className="flex h-full w-full flex-row items-center justify-around p-6">
      <div className="mr-2 flex flex-col items-center gap-4">
        <div className="flex items-center justify-center space-x-2">
          <Label htmlFor="log-level" className="text-nowrap font-semibold">
            全部日志
          </Label>
          <Switch id="log-level" checked={showAllLevel} onCheckedChange={handleLogLevelChange} />
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Label htmlFor="pause" className="text-nowrap font-semibold">
            跟随底部
          </Label>
          <Switch id="pause" checked={isPaused} onCheckedChange={setIsPaused} />
        </div>
      </div>
      <div className={'h-full w-[600px]'}>
        <PrettyLogViewer innerRef={logViewerRef} data={logQueue} hasLineNumbers={false} isTextWrapped={true} />
      </div>
    </div>
  );
};

export default LogViewer;
