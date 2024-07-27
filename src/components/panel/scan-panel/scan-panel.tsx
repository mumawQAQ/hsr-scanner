import React from 'react';

import ScanAction from '@/components/panel/scan-panel/scan-action.tsx';
import ScanContent from '@/components/panel/scan-panel/scan-content.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Label } from '@/components/ui/label.tsx';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import useRelicTemplateStore from '@/hooks/use-relic-template-store.ts';
import useWebclientStore from '@/hooks/use-webclient-store.ts';
import useWindowStore from '@/hooks/use-window-store.ts';
import { cn } from '@/lib/utils.ts';

interface SCanPanelProps {
  isLightMode: boolean;
  setLightMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ScanPanel: React.FC<SCanPanelProps> = ({ isLightMode, setLightMode }) => {
  const { currentRelicRatingRulesTemplate } = useRelicTemplateStore();
  const { scanningStatus, setScanningStatus, scanInterval, setScanInterval } = useWindowStore();
  const { patch } = useWebclientStore();

  const toggleWindowMode = () => {
    const newMode = !isLightMode;
    setLightMode(newMode);
    (window as any).ipcRenderer.changeWindowMode(newMode);
  };

  const handleScanModeChange = async (status: boolean) => {
    await patch('scan-state', status ? 'True' : 'False');
    setScanningStatus(status);
  };

  return (
    <div>
      <ResizablePanelGroup direction="vertical" className={isLightMode ? 'min-h-[310px]' : 'min-h-[880px]'}>
        <div className="mb-2 flex items-center">
          {isLightMode && (
            <p className="max-w-xs truncate">
              当前使用模版：{currentRelicRatingRulesTemplate ? currentRelicRatingRulesTemplate.templateName : '无'}
            </p>
          )}
          <div className="flex-grow"></div>
          {!isLightMode ? (
            ''
          ) : (
            <div className="mr-2 flex items-center justify-center space-x-2">
              <Label htmlFor="scan-mode" className="font-semibold">
                开始扫描
              </Label>
              <Switch id="scan-mode" checked={scanningStatus} onCheckedChange={handleScanModeChange} />
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
                setScanningStatus={handleScanModeChange}
                scanInterval={scanInterval}
                setScanInterval={setScanInterval}
              />
            </div>
            <ScanContent />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className={cn(isLightMode ? 'hidden' : '')} />
        <ResizablePanel defaultSize={50} className={cn(isLightMode ? 'hidden' : '')}>
          <ResizablePanel>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Log Area</span>
            </div>
          </ResizablePanel>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ScanPanel;
