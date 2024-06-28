import React, { useState } from 'react';

import ScanAction from '@/components/panel/scan-panel/scan-action.tsx';
import ScanContent from '@/components/panel/scan-panel/scan-content.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable.tsx';
import { Separator } from '@/components/ui/separator.tsx';

interface SCanPanelProps {
  isLightMode: boolean;
  setLightMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ScanPanel: React.FC<SCanPanelProps> = ({ isLightMode, setLightMode }) => {
  const titlePartRef = React.useRef<HTMLCanvasElement>(null);
  const mainStatsPartRef = React.useRef<HTMLCanvasElement>(null);
  const subStatsPartRef = React.useRef<HTMLCanvasElement>(null);

  const [scanningStatus, setScanningStatus] = useState(false);
  const [scanInterval, setScanInterval] = useState(2000);

  const toggleWindowMode = () => {
    const newMode = !isLightMode;
    setLightMode(newMode);
    (window as any).ipcRenderer.changeWindowMode(newMode);
  };

  return (
    <div>
      <ResizablePanelGroup direction="vertical" className={isLightMode ? 'min-h-[310px]' : 'min-h-[880px]'}>
        <div className="mb-2 flex items-center">
          {!isLightMode ? '' : <p>当前使用模版：</p>}
          <div className="flex-grow"></div>
          <Button onClick={toggleWindowMode} size="sm" className="mr-2">
            {isLightMode ? '正常模式' : '小窗模式'}
          </Button>
        </div>
        <Separator />
        <ResizablePanel defaultSize={50}>
          <div className="flex flex-row justify-start gap-10 p-6">
            {isLightMode ? (
              ''
            ) : (
              <ScanAction
                scanningStatus={scanningStatus}
                setScanningStatus={setScanningStatus}
                scanInterval={scanInterval}
                setScanInterval={setScanInterval}
              />
            )}
            <ScanContent
              scanningStatus={scanningStatus}
              scanInterval={scanInterval}
              titlePartRef={titlePartRef}
              subStatsPartRef={subStatsPartRef}
              mainStatsPartRef={mainStatsPartRef}
            />
          </div>
        </ResizablePanel>
        {isLightMode ? (
          ''
        ) : (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
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
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default ScanPanel;
