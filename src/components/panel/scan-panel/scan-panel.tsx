import React, { useState } from 'react';

import ScanAction from '@/components/panel/scan-panel/scan-action.tsx';
import ScanContent from '@/components/panel/scan-panel/scan-content.tsx';
import ShouldLockRolesList from '@/components/panel/scan-panel/should-lock-roles-list.tsx';
import ValuableSubList from '@/components/panel/scan-panel/valuable-sub-list.tsx';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable.tsx';

const ScanPanel = () => {
  const titlePartRef = React.useRef<HTMLCanvasElement>(null);
  const mainStatsPartRef = React.useRef<HTMLCanvasElement>(null);
  const subStatsPartRef = React.useRef<HTMLCanvasElement>(null);

  const [scanningStatus, setScanningStatus] = useState(false);
  const [scanInterval, setScanInterval] = useState(2000);

  return (
    <ResizablePanelGroup direction="vertical" className="min-h-[880px]">
      <ResizablePanel defaultSize={50}>
        <div className="flex flex-row justify-start gap-10 p-6">
          <ScanAction
            scanningStatus={scanningStatus}
            setScanningStatus={setScanningStatus}
            scanInterval={scanInterval}
            setScanInterval={setScanInterval}
          />
          <ScanContent
            scanningStatus={scanningStatus}
            scanInterval={scanInterval}
            titlePartRef={titlePartRef}
            subStatsPartRef={subStatsPartRef}
            mainStatsPartRef={mainStatsPartRef}
          />
          <ValuableSubList />
          <ShouldLockRolesList />
        </div>
      </ResizablePanel>
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
    </ResizablePanelGroup>
  );
};

export default ScanPanel;
