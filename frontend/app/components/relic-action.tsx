'use client';
import { Switch } from '@nextui-org/switch';
import { FileLock, Image, ListEnd, PanelTop, PictureInPicture, ScanEye } from 'lucide-react';
import { Button } from '@nextui-org/button';
import useWindowStore from '@/app/hooks/use-window-store';
import { useModal } from '@/app/hooks/use-modal-store';
import { useUpdateFullLogState, useUpdateScanState } from '@/app/apis/state';
import { invoke } from '@tauri-apps/api/tauri';

export default function RelicAction() {
  const {
    setScanningStatus,
    scanningStatus,
    imgShow,
    setImageShow,
    logPause,
    setLogPause,
    fullLog,
    setFullLog,
    topWindow,
    setTopWindow,
    isLightMode,
    setIsLightMode,
  } = useWindowStore();
  const { onOpen } = useModal();
  const { mutate: updateFullLogState } = useUpdateFullLogState();
  const { mutate: updateScanState } = useUpdateScanState();

  const handleScanStateChange = async (status: boolean) => {
    updateScanState(status, {
      onSuccess: () => {
        setScanningStatus(status);
      },
    });
  };

  const handleFullLogChange = async (status: boolean) => {
    updateFullLogState(status, {
      onSuccess: () => {
        setFullLog(status);
      },
    });
  };

  const handleSelectTemplate = () => {
    onOpen('select-template');
  };

  const handleSetTopWindow = async (status: boolean) => {
    try {
      await invoke('set_always_on_top', { status });
      setTopWindow(status);
    } catch (error) {
      console.error('Failed to set window top status:', error);
    }
  };

  const handleSetLightMode = async (mode: boolean) => {
    try {
      await invoke('set_window_size', { status: mode });
      setIsLightMode(mode);
    } catch (error) {
      console.error('Failed to set light mode:', error);
    }
  };


  return (
    <div className="flex flex-row gap-4 md:flex-col">
      <Switch color="success" size={isLightMode ? 'sm' : 'md'} thumbIcon={<PanelTop />} isSelected={topWindow}
              onValueChange={handleSetTopWindow}>
        窗口置顶
      </Switch>
      <Switch color="success" size={isLightMode ? 'sm' : 'md'} thumbIcon={<PictureInPicture />} isSelected={isLightMode}
              onValueChange={handleSetLightMode}>
        小屏模式
      </Switch>
      <Switch color="success" size={isLightMode ? 'sm' : 'md'} thumbIcon={<ScanEye />} isSelected={scanningStatus}
              onValueChange={handleScanStateChange}>
        开始扫描
      </Switch>
      <Switch color="success" thumbIcon={<Image />} isSelected={imgShow} onValueChange={setImageShow}
              className="hidden md:block ">
        显示图片
      </Switch>
      <Switch color="success" thumbIcon={<FileLock />} isSelected={fullLog} onValueChange={handleFullLogChange}
              className="hidden md:block">
        全部日志
      </Switch>
      <Switch color="success" thumbIcon={<ListEnd />} isSelected={logPause} onValueChange={setLogPause}
              className="hidden md:block">
        跟随底部
      </Switch>
      <Button size="sm" variant="bordered" className="mt-5 hidden md:block" onPress={handleSelectTemplate}>
        选择模板
      </Button>
    </div>
  );
}
