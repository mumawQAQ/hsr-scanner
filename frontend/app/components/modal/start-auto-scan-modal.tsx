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

const formSchema = z.object({
  bringToFront: z.boolean(),
  skipIfError: z.boolean(),
  relicDiscardScore: z.number().int().min(0).max(100),
});


export const StartAutoScanModal = () => {
  const { isOpen, onClose, type } = useModal();
  const { setAutoRelicAnalysisId } = useWindowStore();
  const isModalOpen = isOpen && type === 'start-auto-scan';
  const startPipeline = useStartPipeline();

  const { control, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bringToFront: true,
      skipIfError: true,
      relicDiscardScore: 40,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = data => {
    startPipeline.mutate({
      pipeline_name: 'AutoRelicAnalysisPipeline',
      meta_data: {
        bring_to_front: data.bringToFront,
        skip_if_error: data.skipIfError,
        relic_discard_score: data.relicDiscardScore / 100,
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
            <ModalHeader>开启自动扫描 | 自动扫描模式可以按e停止</ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <Controller
                  name="bringToFront"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      isSelected={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      游戏窗口置顶
                    </Switch>
                  )}
                />
                <Controller
                  name="skipIfError"
                  control={control}
                  render={({ field }) => (
                    <Switch
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
                      label={'丢弃分数'}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      minValue={0}
                      maxValue={100}
                      step={5}
                    />
                  )}
                />
                <div className="flex justify-center">
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