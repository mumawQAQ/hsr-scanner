import React, { ChangeEvent, useRef, useState } from 'react';
import jsQR, { QRCode } from 'jsqr';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

interface DragAndDropProps {
  onQRCodeData?: (data: string | null) => void;
}

const DragAndDrop: React.FC<DragAndDropProps> = ({ onQRCodeData }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPreview(reader.result);
          decodeQRCode(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('请选择图片文件');
      setPreview(null);
      if (onQRCodeData) {
        onQRCodeData(null);
      }
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (onQRCodeData) {
      onQRCodeData(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const decodeQRCode = (dataURL: string) => {
    const img = new Image();
    img.src = dataURL;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) {
        toast.error('初始化画布失败，请重试');
        return;
      }
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code: QRCode | null = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        if (onQRCodeData) {
          onQRCodeData(code.data);
        }
      } else {
        toast.error('未能识别到二维码，请重试');
        if (onQRCodeData) {
          onQRCodeData(null);
        }
      }
    };
    img.onerror = () => {
      toast.error('导入图片识别，请重试');
      if (onQRCodeData) {
        onQRCodeData(null);
      }
    };
  };

  return (
    <div>
      <div
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer transition-colors`}
        onClick={handleClick}
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-64 h-64 object-cover rounded-md" />
            <X onClick={handleRemoveImage}
               className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            />
          </div>
        ) : (
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 100-8 4 4 0 000 8zm10-4a4 4 0 11-8 0 4 4 0 018 0zM5 12a4 4 0 118 0 4 4 0 01-8 0zm14 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <p className="mt-4 text-gray-400">点击选择上传二维码</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileInputChange}
        />
      </div>
    </div>
  );
};

export default DragAndDrop;
