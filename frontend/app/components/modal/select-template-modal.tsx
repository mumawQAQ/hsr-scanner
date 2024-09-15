'use client';
import { useModal } from '@/app/hooks/use-modal-store';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/react';

const SelectTemplateActionRow = () => {
  return (
    <Tooltip
      showArrow
      content={
        <div>
          <div className="flex flex-row gap-1">
            <p className="font-semibold">作者:</p>
            <p>author</p>
          </div>
          <div className="flex flex-row gap-1">
            <p className="font-semibold">描述:</p>
            <p>description</p>
          </div>
        </div>
      }
      color="foreground"
    >
      <div
        className="hover:border-1 flex cursor-pointer flex-row items-center justify-between rounded p-2 hover:border-gray-700 hover:shadow-md"
        onClick={() => {
          console.log('click');
        }}
      >
        <div>模板名称</div>
        <div className="flex flex-row gap-2">
          <Button size="sm" variant="bordered" color="default">
            选择
          </Button>
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
  const isModalOpen = isOpen && type === 'select-template';

  return (
    <Modal isOpen={isModalOpen} size="md" onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>选择模板</ModalHeader>
            <ModalBody>
              <SelectTemplateActionRow />
              <SelectTemplateActionRow />
              <SelectTemplateActionRow />
            </ModalBody>
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
