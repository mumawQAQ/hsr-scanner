import { ChevronLeft } from 'lucide-react';
import { compress } from 'compress-json';
import QRCode from 'qrcode';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button.tsx';
import { useModal } from '@/hooks/use-modal-store.ts';
import useRelicTemplateStore from '@/hooks/use-relic-template-store.ts';
import { cn } from '@/lib/utils.ts';

export function RelicToolNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { onOpen } = useModal();
  const { currentRelicRatingRulesTemplate } = useRelicTemplateStore();

  const shouldShowBackButton = location.pathname !== '/relic-tools';
  const shouldShowExportButton = location.pathname.includes('/relic-tools/createEdit');

  const handleCreateTemplate = () => {
    onOpen('create-relic-rules-template');
  };

  const handleExport = async () => {
    if (!currentRelicRatingRulesTemplate) {
      toast('当前没有规则模板', { type: 'error' });
      return;
    }
    const jsonTemplate = JSON.stringify(compress(currentRelicRatingRulesTemplate));

    console.log(jsonTemplate);

    try {
      // generate a qr code from jsonTemplate
      const qrcode = await QRCode.toDataURL(jsonTemplate, { version: 40 });
      onOpen('export-relic-rules-template', { qrCode: qrcode });
    } catch (error) {
      if (error instanceof Error) {
        toast(`导出失败，${error.message}`, { type: 'error' });
      } else {
        toast('未知原因，导出失败', { type: 'error' });
      }
    }
  };

  const handleImport = () => {
    onOpen('import-qr-code-model');
  };

  return (
    <div className="mb-4 flex justify-between">
      <ChevronLeft
        onClick={() => navigate(-1)}
        className={cn(
          'h-8 w-8 cursor-pointer transition-all hover:text-gray-500/90',
          shouldShowBackButton ? 'opacity-100' : 'opacity-0'
        )}
      />
      <div className="flex gap-5">
        {!shouldShowBackButton && <Button onClick={handleCreateTemplate}>创建新规则模板</Button>}
        {shouldShowExportButton && <Button onClick={handleExport}>导出</Button>}
        {!shouldShowBackButton && <Button onClick={handleImport}>导入</Button>}
      </div>
    </div>
  );
}

export default RelicToolNavbar;
