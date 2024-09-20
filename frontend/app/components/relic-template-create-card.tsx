'use client';
import { Card, CardBody } from '@nextui-org/card';
import { Plus } from 'lucide-react';
import { useModal } from '@/app/hooks/use-modal-store';

export default function RelicTemplateCreateCard() {
  const { onOpen } = useModal();

  const handleCreateTemplate = () => {
    onOpen('create-template');
  };

  return (
    <Card className="h-[17rem] w-[15rem] grid-cols-1" shadow="sm" isPressable onPress={handleCreateTemplate}>
      <CardBody className="flex items-center justify-center">
        <Plus />
      </CardBody>
    </Card>
  );
}
