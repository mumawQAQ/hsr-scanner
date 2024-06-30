import { Button } from '@/components/ui/button.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Slider } from '@/components/ui/slider.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import { useModal } from '@/hooks/use-modal-store.ts';

type ScanActionProps = {
  scanningStatus: boolean;
  setScanningStatus: (status: boolean) => void;
  scanInterval: number;
  setScanInterval: (interval: number) => void;
};

const ScanAction = ({ scanningStatus, setScanningStatus, scanInterval, setScanInterval }: ScanActionProps) => {
  const { onOpen } = useModal();

  const handleRelicRuleTemplateIn = () => {
    onOpen('import-relic-rules-template');
  };

  return (
    <div className="flex h-full min-w-[15%] flex-col gap-y-4">
      <div className="flex flex-col items-center gap-y-4">
        <Label htmlFor="scan-interval" className="font-semibold">
          扫描间隔
        </Label>
        <Slider
          id="scan-interval"
          defaultValue={[scanInterval]}
          min={500}
          max={10000}
          step={100}
          onValueCommit={([value]) => setScanInterval(value)}
        />
      </div>
      <div className="flex items-center justify-center space-x-2">
        <Label htmlFor="scan-mode" className="font-semibold text-nowrap">
          开始扫描
        </Label>
        <Switch id="scan-mode" checked={scanningStatus} onCheckedChange={setScanningStatus} />
      </div>
      <Button size="sm" onClick={handleRelicRuleTemplateIn}>
        选择模板
      </Button>
    </div>
  );
};

export default ScanAction;
