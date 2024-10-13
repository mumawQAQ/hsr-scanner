'use client';
import { useModal } from '@/app/hooks/use-modal-store';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { z } from 'zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@nextui-org/input';
import { v4 as uuidv4 } from 'uuid';
import { useCreateTemplate } from '@/app/apis/relic-template';
import toast from 'react-hot-toast';

const formSchema = z.object({
  name: z.string().min(1, {
    message: '名称不能为空',
  }),
  description: z.string().min(1, {
    message: '描述不能为空',
  }),
  author: z.string().min(1, {
    message: '作者不能为空',
  }),
});

const CreateTemplateModal = () => {
  const { isOpen, onClose, type } = useModal();
  const { mutate: createTemplate } = useCreateTemplate();
  const isModalOpen = isOpen && type === 'create-template';

  const { control, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      author: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = data => {
    const templateId = uuidv4();
    createTemplate(
      {
        id: templateId,
        name: data.name,
        description: data.description,
        author: data.author,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
        onError: e => {
          toast.error(`创建模板失败, 请重试, ${e.message}`);
        },
      },
    );
  };

  const isLoading = formState.isSubmitting;

  return (
    <Modal isOpen={isModalOpen} size="md" onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>创建模板</ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="模板名称"
                      placeholder="输入模板名称"
                      errorMessage={formState.errors.name?.message}
                      isInvalid={!!formState.errors.name}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="模板描述"
                      placeholder="输入模板描述"
                      errorMessage={formState.errors.description?.message}
                      isInvalid={!!formState.errors.description}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="author"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="作者"
                      placeholder="输入作者名称"
                      errorMessage={formState.errors.author?.message}
                      isInvalid={!!formState.errors.author}
                      {...field}
                    />
                  )}
                />
                <div className="flex justify-center">
                  <Button size="md" variant="bordered" color="default" disabled={isLoading} type="submit">
                    确定
                  </Button>
                </div>
              </form>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateTemplateModal;
