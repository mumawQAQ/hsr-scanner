import React, { useEffect, useState } from 'react';

import ScanAction from '@/components/panel/scan-panel/scan-action.tsx';
import ScanContent from '@/components/panel/scan-panel/scan-content.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Label } from '@/components/ui/label.tsx';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import { cn } from '@/lib/utils.ts';

interface SCanPanelProps {
  isLightMode: boolean;
  setLightMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ScanPanel: React.FC<SCanPanelProps> = ({ isLightMode, setLightMode }) => {
  const titlePartRef = React.useRef<HTMLCanvasElement>(null);
  const mainStatsPartRef = React.useRef<HTMLCanvasElement>(null);
  const subStatsPartRef = React.useRef<HTMLCanvasElement>(null);

  const [scanningStatus, setScanningStatus] = useState(() => {
    const storedStatus = localStorage.getItem('scanningStatus');
    return storedStatus ? storedStatus === 'true' : false;
  });

  const [scanInterval, setScanInterval] = useState(() => {
    const storedInterval = localStorage.getItem('scanInterval');
    return storedInterval ? parseInt(storedInterval, 10) : 2000;
  });

  const toggleWindowMode = () => {
    const newMode = !isLightMode;
    setLightMode(newMode);
    (window as any).ipcRenderer.changeWindowMode(newMode);
  };

  useEffect(() => {
    localStorage.setItem('scanningStatus', String(scanningStatus));
  }, [scanningStatus]);

  useEffect(() => {
    localStorage.setItem('scanInterval', scanInterval.toString());
  }, [scanInterval]);

  return (
    <div>
      <ResizablePanelGroup direction="vertical" className={isLightMode ? 'min-h-[310px]' : 'min-h-[880px]'}>
        <div className="mb-2 flex items-center">
          {!isLightMode ? '' : <p>当前使用模版：</p>}
          <div className="flex-grow"></div>
          {!isLightMode ? (
            ''
          ) : (
            <div className="mr-2 flex items-center justify-center space-x-2">
              <Label htmlFor="scan-mode" className="font-semibold">
                开始扫描
              </Label>
              <Switch id="scan-mode" checked={scanningStatus} onCheckedChange={setScanningStatus} />
            </div>
          )}

          <Button onClick={toggleWindowMode} size="sm" className="mr-2">
            {isLightMode ? '切换为正常模式' : '切换为小窗模式'}
          </Button>
        </div>
        <Separator />
        <ResizablePanel defaultSize={isLightMode ? 100 : 50}>
          <div className="flex flex-row justify-start gap-10 pt-6">
            <div className={isLightMode ? 'hidden' : ''}>
              <ScanAction
                scanningStatus={scanningStatus}
                setScanningStatus={setScanningStatus}
                scanInterval={scanInterval}
                setScanInterval={setScanInterval}
              />
            </div>
            <ScanContent
              scanningStatus={scanningStatus}
              scanInterval={scanInterval}
              titlePartRef={titlePartRef}
              subStatsPartRef={subStatsPartRef}
              mainStatsPartRef={mainStatsPartRef}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className={cn(isLightMode ? 'hidden' : '')} />
        <ResizablePanel defaultSize={50} className={cn(isLightMode ? 'hidden' : '')}>
          <ResizablePanelGroup direction="horizontal" className="min-h-[200px]">
            <ResizablePanel defaultSize={35}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Log Area</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <div className="flex h-full flex-col items-center justify-center p-6">
                <canvas ref={titlePartRef} />
                <canvas ref={mainStatsPartRef} />
                <canvas ref={subStatsPartRef} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ScanPanel;
