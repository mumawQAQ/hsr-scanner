import { useDeleteTemplate, useRelicTemplateList, useSelectTemplate, useUnselectTemplate } from '@/apis/relic-template'
import { RelicTemplate } from '@/types/relic-template-types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx'
import { Button } from '@/components/ui/button.tsx'
import { cn } from '@/lib/utils'
import { useModal } from '@/hooks/use-modal.ts'
import Spinner from '@/components/spinner.tsx'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog.tsx'
import { useEffect } from 'react'
import { useBackend } from '@/hooks/use-backend.ts'

const RatingTemplateActionRow = ({ relicTemplate }: { relicTemplate: RelicTemplate }) => {
    const { mutate: selectTemplate } = useSelectTemplate()
    const { mutate: unselectTemplate } = useUnselectTemplate()
    const { mutate: deleteTemplate } = useDeleteTemplate()

    const handleUnselectTemplate = () => {
        unselectTemplate(relicTemplate.id)
    }

    const handleSelectTemplate = () => {
        selectTemplate(relicTemplate.id)
    }

    const handleDeleteTemplate = () => {
        deleteTemplate(relicTemplate.id)
    }
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="w-full">
                    <div
                        className={cn(
                            'my-2 flex cursor-pointer flex-row items-center justify-between py-2 px-4 ',
                            relicTemplate.in_use
                                ? 'shadow-md border-2 border-primary bg-primary-light rounded-xl'
                                : 'shadow-sm border border-gray-200 rounded-lg'
                        )}
                        onClick={() => {
                            console.log('click')
                        }}
                    >
                        <div>{relicTemplate.name}</div>
                        <div className="flex flex-row gap-2">
                            {relicTemplate.in_use ? (
                                <Button onClick={handleUnselectTemplate}>停用</Button>
                            ) : (
                                <>
                                    <Button onClick={handleSelectTemplate}>启用</Button>
                                    <Button variant="destructive" onClick={handleDeleteTemplate}>
                                        删除
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </TooltipTrigger>

                <TooltipContent>
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
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

const SelectTemplateModal = () => {
    const { isOpen, onClose, type, onOpen } = useModal()
    const relicTemplates = useRelicTemplateList()
    const backendStore = useBackend()
    const isModalOpen = isOpen && type === 'select-template'

    useEffect(() => {
        if (backendStore.backendPort) {
            relicTemplates.refetch()
        }
    }, [backendStore.backendPort])

    const handleCreateTemplate = () => {
        onOpen('create-template')
    }
    const handleImportTemplate = () => {
        onOpen('import-template')
    }

    const renderTemplateList = () => {
        if (relicTemplates.isLoading) {
            return <Spinner />
        }

        if (relicTemplates.error || !relicTemplates.data || relicTemplates.data.length === 0) {
            return <div>暂无模板</div>
        }

        return (
            <div className="max-h-64 overflow-auto">
                {relicTemplates.data.map((relicTemplate) => (
                    <RatingTemplateActionRow key={relicTemplate.id} relicTemplate={relicTemplate} />
                ))}
            </div>
        )
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>选择模板</DialogHeader>
                {renderTemplateList()}
                <DialogFooter>
                    <Button onClick={handleCreateTemplate}>创建模板</Button>
                    <Button onClick={handleImportTemplate}>导入模板</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export default SelectTemplateModal
