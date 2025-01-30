import { useModal } from '@/hooks/use-modal'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateTemplate } from '@/apis/relic-template'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'

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
})

const CreateTemplateModal = () => {
    const { isOpen, onClose, type } = useModal()
    const { mutate: createTemplate } = useCreateTemplate()
    const isModalOpen = isOpen && type === 'create-template'

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            author: '',
        },
    })

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
        const templateId = uuidv4()
        createTemplate(
            {
                id: templateId,
                name: data.name,
                description: data.description,
                author: data.author,
            },
            {
                onSuccess: () => {
                    form.reset()
                    onClose()
                },
                onError: (e) => {
                    toast.error(`创建模板失败, 请重试, ${e.message}`)
                },
            }
        )
    }

    const isLoading = form.formState.isSubmitting

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>创建模板</DialogTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>模板名称</FormLabel>
                                    <FormControl>
                                        <Input placeholder="输入模板名称" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>模板描述</FormLabel>
                                    <FormControl>
                                        <Input placeholder="输入模板描述" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Controller
                            name="author"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>作者</FormLabel>
                                    <FormControl>
                                        <Input placeholder="输入作者名称" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-center">
                            <Button disabled={isLoading} type="submit">
                                确定
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateTemplateModal
