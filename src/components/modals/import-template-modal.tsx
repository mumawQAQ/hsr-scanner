import { useImportTemplate } from '@/apis/relic-template'
import { useModal } from '@/hooks/use-modal'
import { useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { Button } from '@/components/ui/button.tsx'

export const ImportTemplateModal = () => {
    const [templateCode, setTemplateCode] = useState<string>('')
    const { isOpen, onClose, onOpen, type } = useModal()
    const importTemplate = useImportTemplate()
    const isModalOpen = isOpen && type === 'import-template'

    const handleImportTemplateCode = () => {
        if (!templateCode) {
            return
        }
        importTemplate.mutate(templateCode, {
            onSuccess: () => {
                onOpen('select-template')
            },
            onError: () => {
                toast.error('导入模板失败，请检查模板代码是否正确, 检查是否是最新资源, 或联系作者反馈')
            },
        })
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>请输入模板代码以导入模板</DialogTitle>
                <div className="grid w-full gap-1.5">
                    <Textarea
                        placeholder="模板代码"
                        id="template-code"
                        onChange={(e) => {
                            setTemplateCode(e.target.value)
                        }}
                        value={templateCode}
                    />
                </div>
                <DialogFooter>
                    <Button onClick={handleImportTemplateCode}>导入代码</Button>
                    <Button onClick={onClose}>关闭</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
