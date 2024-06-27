import { Button } from '@/components/ui/button.tsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils.ts';
import { ChevronLeft } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store.ts';

export function RelicToolNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { onOpen } = useModal();

  const shouldShowBackButton = location.pathname !== '/relic-tools';
  const shouldShowExportButton =
    location.pathname.includes('/relic-tools/edit') || location.pathname.includes('/relic-tools/create');

  const handleCreateTemplate = () => {
    onOpen('create-relic-rules-template');
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
        {shouldShowExportButton && <Button>导出</Button>}
        {!shouldShowBackButton && <Button>导入</Button>}
      </div>
    </div>
  );
}

export default RelicToolNavbar;
