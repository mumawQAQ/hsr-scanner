'use client';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { RelicTemplate } from '@/app/types/relic-template-types';
import { cn } from '@/app/utils/tailwind-utils';
import { useRouter } from 'next/navigation';
import { usePath } from '@/app/hooks/use-path-store';

type RelicTemplateCardProps = {
  template: RelicTemplate;
};

export default function RelicTemplateCard({ template }: RelicTemplateCardProps) {
  const router = useRouter();
  const { setViewTemplateId } = usePath();
  const handleSelectTemplate = () => {
    setViewTemplateId(template.id);
    router.push('/dashboard/relic-rules');
  };
  return (
    <Card
      className={cn(
        'hover:border-1 h-[17rem] w-[14rem] grid-cols-1 hover:border-gray-700 hover:shadow-xl',
        template.in_use && 'border-1 border-gray-600/40 shadow-md',
      )}
      isPressable
      onPress={handleSelectTemplate}
    >
      <CardBody className="flex items-center justify-center text-center">
        <div className="flex flex-col gap-3">
          <div className="line-clamp-1 font-semibold">{template.name}</div>
          <div className="text-tiny line-clamp-2 font-light">{template.description}</div>
        </div>
      </CardBody>
      <CardFooter className="flex justify-center">
        <div>{template.author}</div>
      </CardFooter>
    </Card>
  );
}
