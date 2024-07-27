import { throttle } from 'lodash';
import { useEffect, useState } from 'react';

type Log = {
  data: string;
  uuid: string;
};

const LogViewer = () => {
  const [logQueue, setLogQueue] = useState<Log[]>([]);

  useEffect(() => {
    const throttledAddLog = throttle((data: string) => {
      setLogQueue(prevLogs => {
        const newLogs = [
          ...prevLogs,
          {
            data,
            uuid: Math.random().toString(36).substring(7),
          },
        ];
        return newLogs.length > 5 ? newLogs.slice(1) : newLogs;
      });
    }, 1000); // Update at most once per second

    const listener = (_: any, data: string) => {
      throttledAddLog(data);
    };

    window.ipcRenderer.on('backend-log', listener);
    return () => {
      throttledAddLog.cancel();
    };
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <div className="font-semibold">Log Area</div>
      <div>
        {logQueue.map(log => (
          <div key={log.uuid} className="text-sm">
            {log.data}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogViewer;
