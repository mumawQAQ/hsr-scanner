'use client';
import { useModal } from '@/app/hooks/use-modal-store';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Spinner, Tooltip } from '@nextui-org/react';
import { useRelicTemplateList, useSelectTemplate } from '@/app/apis/relic-template';
import { RelicTemplate } from '@/app/types/relic-template-types';
import { cn } from '@/app/utils/tailwind-utils';

const SelectTemplateActionRow = ({ relicTemplate }: { relicTemplate: RelicTemplate }) => {
  const { mutate: selectTemplate } = useSelectTemplate();

  const handleSelectTemplate = () => {
    selectTemplate(relicTemplate.id);
  };
  return (
    <Tooltip
      placement="left"
      showArrow
      content={
        <div>
          <div className="flex flex-row gap-1">
            <p className="font-semibold">作者:</p>
            <p>{relicTemplate.author}</p>
          </div>
          <div className="flex flex-row gap-1">
            <p className="font-semibold">描述:</p>
            <p>{relicTemplate.description}</p>
          </div>
        </div>
      }
      color="foreground"
    >
      <div
        className={cn(
          'my-2 flex cursor-pointer flex-row items-center justify-between rounded p-2',
          relicTemplate.inUse && 'border-1 border-gray-700/50 shadow-md'
        )}
        onClick={() => {
          console.log('click');
        }}
      >
        <div>{relicTemplate.name}</div>
        <div className="flex flex-row gap-2">
          {!relicTemplate.inUse && (
            <Button size="sm" variant="bordered" color="default" onPress={handleSelectTemplate}>
              选择
            </Button>
          )}
          <Button size="sm" variant="bordered" color="danger">
            删除
          </Button>
        </div>
      </div>
    </Tooltip>
  );
};

const SelectTemplateModal = () => {
  const { isOpen, onClose, type } = useModal();
  const { data: relicTemplates, error, isLoading } = useRelicTemplateList();
  const isModalOpen = isOpen && type === 'select-template';

  const renderTemplateList = () => {
    if (isLoading) {
      return <Spinner />;
    }

    if (error || !relicTemplates) {
      return <div>暂无模板</div>;
    }

    return (
      <div>
        {relicTemplates.map(relicTemplate => (
          <SelectTemplateActionRow key={relicTemplate.id} relicTemplate={relicTemplate} />
        ))}
      </div>
    );
  };

  return (
    <Modal isOpen={isModalOpen} size="md" onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>选择模板</ModalHeader>
            <ModalBody>{renderTemplateList()}</ModalBody>
            <ModalFooter>
              <Button size="md" variant="bordered" color="default">
                创建模板
              </Button>
              <Button size="md" variant="bordered" color="default">
                导入模板
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default SelectTemplateModal;
