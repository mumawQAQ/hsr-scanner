import { useModal } from '@/app/hooks/use-modal-store';
import { Button } from '@nextui-org/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Switch } from '@nextui-org/switch';
import { Slider } from '@nextui-org/react';
import { useStartPipeline } from '@/app/apis/pipeline';
import toast from 'react-hot-toast';
import useWindowStore from '@/app/hooks/use-window-store';
import { Input } from '@nextui-org/input';
import { useMousePosition } from '@/app/apis/state';

const formSchema = z.object({
  skipIfError: z.boolean(),
  relicDiscardScore: z.number().int().min(0).max(100),
  mouseX: z.number().int().optional().nullable(),
  mouseY: z.number().int().optional().nullable(),
});


export const StartAutoScanModal = () => {
  const { isOpen, onClose, type } = useModal();
  const { setAutoRelicAnalysisId } = useWindowStore();
  const isModalOpen = isOpen && type === 'start-auto-scan';
  const startPipeline = useStartPipeline();
  const mousePosition = useMousePosition();

  const { control, handleSubmit, formState, reset, getValues } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skipIfError: true,
      relicDiscardScore: 40,
      mouseX: null,
      mouseY: null,
    },
  });

  const handlePreviewMousePosition = () => {
    const { mouseX, mouseY } = getValues();
    if (mouseX === null || mouseY === null) {
      toast.error('请先填写鼠标位置');
      return;
    }

    mousePosition.mutate({
      mouse_x: mouseX,
      mouse_y: mouseY,
    }, {
      onError: e => {
        toast.error(`预览鼠标位置失败, 请重试, ${e.message}`);
      },
    });

  };

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = data => {
    startPipeline.mutate({
      pipeline_name: 'AutoRelicAnalysisPipeline',
      meta_data: {
        skip_if_error: data.skipIfError,
        relic_discard_score: data.relicDiscardScore / 100,
        mouse_x: data.mouseX,
        mouse_y: data.mouseY
      },
    }, {
      onSuccess: (data) => {
        setAutoRelicAnalysisId(data.pipeline_id);

        reset();
        onClose();
      },
      onError: e => {
        toast.error(`启动扫描失败, 请重试, ${e.message}`);
      },
    });
  };

  const isLoading = formState.isSubmitting;

  return (
    <Modal isOpen={isModalOpen} size="sm" onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>开启自动扫描</ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                <Controller
                  name="skipIfError"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      size={'sm'}
                      isSelected={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      出错跳过
                    </Switch>
                  )}
                />
                <Controller
                  name="relicDiscardScore"
                  control={control}
                  render={({ field }) => (
                    <Slider
                      size="sm"
                      label={'丢弃分数'}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      minValue={0}
                      maxValue={100}
                      step={5}
                    />
                  )}
                />
                <Controller
                  name="mouseX"
                  control={control}
                  render={({ field }) => (
                    <Input
                      size={'sm'}
                      label={'鼠标X坐标'}
                      value={field.value ?? ''}
                      placeholder={'不填为自动识别'}
                      onValueChange={(value) => {
                        const parsed = parseInt(value, 10);
                        field.onChange(isNaN(parsed) ? null : parsed);
                      }}
                    />
                  )}
                />
                <Controller
                  name="mouseY"
                  control={control}
                  render={({ field }) => (
                    <Input
                      size={'sm'}
                      label={'鼠标Y坐标'}
                      value={field.value ?? ''}
                      placeholder={'不填为自动识别'}
                      onValueChange={(value) => {
                        const parsed = parseInt(value, 10);
                        field.onChange(isNaN(parsed) ? null : parsed);
                      }}
                    />
                  )}
                />

                <div className="flex justify-center gap-2">
                  <Button size="md" variant="bordered" color="default" disabled={isLoading}
                          onPress={handlePreviewMousePosition}>
                    预览鼠标位置
                  </Button>
                  <Button size="md" variant="bordered" color="default" disabled={isLoading} type="submit">
                    {
                      isLoading ? '正在启动...' : '确定'
                    }
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