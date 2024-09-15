'use client';
import { Switch } from '@nextui-org/switch';
import { FileLock, Image, ListEnd, ScanEye } from 'lucide-react';
import { Button } from '@nextui-org/button';
import useWindowStore from '@/app/hooks/use-window-store';
import { useModal } from '@/app/hooks/use-modal-store';
import { useUpdateFullLogState, useUpdateScanState } from '@/app/apis/state';

export default function RelicAction() {
  const { setScanningStatus, scanningStatus, imgShow, setImageShow, logPause, setLogPause, fullLog, setFullLog } =
    useWindowStore();
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

  return (
    <div className="flex flex-col gap-4">
      <Switch color="success" thumbIcon={<ScanEye />} isSelected={scanningStatus} onValueChange={handleScanStateChange}>
        开始扫描
      </Switch>
      <Switch color="success" thumbIcon={<Image />} isSelected={imgShow} onValueChange={setImageShow}>
        显示图片
      </Switch>
      <Switch color="success" thumbIcon={<FileLock />} isSelected={fullLog} onValueChange={handleFullLogChange}>
        全部日志
      </Switch>
      <Switch color="success" thumbIcon={<ListEnd />} isSelected={logPause} onValueChange={setLogPause}>
        跟随底部
      </Switch>
      <Button size="sm" variant="bordered" className="mt-5" onPress={handleSelectTemplate}>
        选择模板
      </Button>
    </div>
  );
}
