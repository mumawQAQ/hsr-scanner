'use client';
import { Switch } from '@nextui-org/switch';
import { FileLock, Image, ListEnd, ScanEye } from 'lucide-react';
import { Button } from '@nextui-org/button';
import useWindowStore from '@/app/hooks/use-window-store';
import useBackendClientStore from '@/app/hooks/use-backend-client-store';

export default function RelicAction() {
  const { setScanningStatus, scanningStatus, imgShow, setImageShow, logPause, setLogPause } = useWindowStore();
  const { patch } = useBackendClientStore();

  const handleScanStateChange = async (status: boolean) => {
    await patch('scan-state', status.toString());
    setScanningStatus(status);
  };

  return (
    <div className="flex flex-col gap-4">
      <Switch color="success" thumbIcon={<ScanEye />} isSelected={scanningStatus} onValueChange={handleScanStateChange}>
        开始扫描
      </Switch>
      <Switch color="success" thumbIcon={<Image />} isSelected={imgShow} onValueChange={setImageShow}>
        显示图片
      </Switch>
      <Switch color="success" thumbIcon={<FileLock />}>
        全部日志
      </Switch>
      <Switch color="success" thumbIcon={<ListEnd />} isSelected={logPause} onValueChange={setLogPause}>
        跟随底部
      </Switch>
      <Button size="sm" variant="bordered" className="mt-5">
        选择模板
      </Button>
    </div>
  );
}
