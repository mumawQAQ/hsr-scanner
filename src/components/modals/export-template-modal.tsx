import { useModal } from '@/hooks/use-modal'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog.tsx'
import { Label } from '@radix-ui/react-label'
import { Button } from '@/components/ui/button.tsx'
import { Check, Copy } from 'lucide-react'
import { Input } from '@/components/ui/input.tsx'
import { useState } from 'react'
import { toast } from 'sonner'

export const ExportTemplateModal = () => {
    const { isOpen, onClose, data, type } = useModal()
    const [copying, setCopying] = useState(false)
    const isModalOpen = isOpen && type === 'export-template'

    const handleCopy = async () => {
        if (copying) {
            return
        }

        setCopying(true)
        await navigator.clipboard.writeText(String(data.qrCodeData))
        toast.success('代码复制成功', {
            position: 'bottom-center',
        })
        setTimeout(() => {
            setCopying(false)
        }, 2000)
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>复制以下模板代码</DialogTitle>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="code" className="sr-only">
                            code
                        </Label>
                        <Input id="code" defaultValue={String(data.qrCodeData)} readOnly />
                    </div>
                    <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
                        <span className="sr-only">Copy</span>
                        {copying ? <Check /> : <Copy />}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
