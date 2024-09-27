import Image from 'next/image';
import { useImage } from '@/app/apis/files';
import { Spinner } from '@nextui-org/react';

export type ImageDisplayProps = {
  filePath: string;
  height?: number;
  width?: number;
  className?: string;
};

export default function ImageDisplay({ filePath, width = 100, height = 100, className }: ImageDisplayProps) {
  const { data: imgSrc, error, isLoading } = useImage(filePath);

  if (error || !imgSrc) {
    console.error('Failed to fetch image:', error);
    return null;
  }

  if (isLoading) {
    return <Spinner size="sm" />;
  }

  return <Image src={imgSrc} alt="img" width={width} height={height} className={className ?? ''} />;
}
