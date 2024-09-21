'use client';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@nextui-org/button';
import { usePath } from '@/app/hooks/use-path-store';

export default function RelicRules() {
  const router = useRouter();
  const { viewTemplateId: templateId } = usePath();

  if (!templateId) {
    return <div>Invalid Template ID</div>;
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <h1>Relic Rules</h1>
      <p>Template ID: {templateId}</p>

      <div className="absolute bottom-4 right-10 space-x-2">
        <Button size="md" variant="bordered" color="default">
          选择
        </Button>
        <Button size="md" variant="bordered" color="default">
          保存
        </Button>
      </div>
      <ChevronLeft size={32} className="absolute bottom-4 left-4 cursor-pointer" onClick={handleBack} />
    </div>
  );
}
