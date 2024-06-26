import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';

import { RelicRulesTemplate } from '../../../types.ts';

import { Button } from '@/components/ui/button.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useModal } from '@/hooks/use-modal-store.ts';
import useRelicStore from '@/hooks/use-relic-store.ts';
import useRelicTemplateStore from '@/hooks/use-relic-template-store.ts';

const formSchema = z.object({
  name: z.string().min(1, {
    message: '名称不能为空',
  }),
  valuableSub: z.boolean().default(true),
  shouldLock: z.boolean().default(true),
  isTemp: z.boolean().default(false),
});

const RelicRuleTemplateOutModal = () => {
  const { isOpen, onClose, type } = useModal();
  const { relicRatingInfo } = useRelicStore();
  const { addRelicRulesTemplate, addRelicTempRulesTemplate } = useRelicTemplateStore();

  const isModalOpen = isOpen && type === 'create-relic-rules-template';

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      valuableSub: true,
      shouldLock: true,
      isTemp: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!relicRatingInfo) {
      toast('暂无可导出规则，请先扫描遗器, 并添加规则！', { type: 'error' });
      return;
    }

    const { name, valuableSub, shouldLock, isTemp } = data;

    // if both valuableSub and shouldLock are false, show error message
    if (!valuableSub && !shouldLock) {
      toast('请至少选择一项导出内容', { type: 'error' });
      return;
    }

    const templateId = uuidv4();
    const relicRulesTemplate: RelicRulesTemplate = { name };

    if (valuableSub) {
      relicRulesTemplate.valuableSub = JSON.parse(JSON.stringify(relicRatingInfo.valuableSub));
    }
    if (shouldLock) {
      relicRulesTemplate.shouldLock = JSON.parse(JSON.stringify(relicRatingInfo.shouldLock));
    }

    // check if the template is temporary
    if (isTemp) {
      const { success, message } = addRelicTempRulesTemplate(templateId, relicRulesTemplate);

      if (success) {
        toast('成功导出规则模板', { type: 'success' });
        handleClose();
      } else {
        toast(message, { type: 'error' });
      }
    } else {
      const { success, message } = await addRelicRulesTemplate(templateId, relicRulesTemplate);

      if (success) {
        toast('成功导出规则模板', { type: 'success' });
        handleClose();
      } else {
        toast(message, { type: 'error' });
      }
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">导出当前遗器筛选条件为模板</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
                      模板名称
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="请输入模板名称"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valuableSub"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>是否导出有效副属性</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shouldLock"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>是否导出锁定规则</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isTemp"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>是否设置为临时模板</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex flex-row bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                导出
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RelicRuleTemplateOutModal;
