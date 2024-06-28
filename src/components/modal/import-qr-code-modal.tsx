import jsQR from 'jsqr';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store.ts';
import useRelicTemplateStore from '@/hooks/use-relic-template-store.ts';
import { RatingTemplate } from '@/type/types.ts';

const ImportQRCodeModal = () => {
  const { createOrUpdateRelicRatingRulesTemplate } = useRelicTemplateStore();
  const { isOpen, onClose, type } = useModal();
  const inputRef = useRef<HTMLInputElement>(null);

  const isModalOpen = isOpen && type === 'import-qr-code-model';

  const handleClose = () => {
    onClose();
  };

  const handleImportQRCode = () => {
    if (inputRef.current?.files) {
      const file = inputRef.current.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const qrCode = reader.result as string;
        const image = new Image();
        image.onload = async () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d')!;
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            try {
              const template = JSON.parse(code.data) as RatingTemplate;
              // generate a new id for the template
              const templateId = uuidv4();
              const result = await createOrUpdateRelicRatingRulesTemplate(templateId, template);

              if (result.success) {
                toast('成功导入遗器规则模板', { type: 'success' });
                handleClose();
              } else {
                toast('导入遗器规则模板失败', { type: 'error' });
              }
            } catch (error) {
              toast('无效遗器规则模板', { type: 'error' });
            }
          } else {
            toast('无法识别二维码', { type: 'error' });
          }
        };
        image.src = qrCode;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">导入配置文件二维码</DialogTitle>
        </DialogHeader>

        <div className="text-center">
          <input type="file" ref={inputRef} accept="image/*" onChange={handleImportQRCode} />
        </div>

        <DialogFooter className="flex flex-row bg-gray-100 px-6 py-4">上传二维码文件导入遗器配置</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportQRCodeModal;
