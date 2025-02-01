import Spinner from '@/components/spinner.tsx'
import { useImage } from '@/apis/files'

export type ImageDisplayProps = {
    filePath: string
    height?: number
    width?: number
    className?: string
}

export default function ImageDisplay({ filePath, width = 100, height = 100, className }: ImageDisplayProps) {
    const { data: imgSrc, error, isLoading } = useImage(filePath)

    if (error) {
        console.error('Failed to fetch image:', error)
        return null
    }

    if (isLoading) {
        return <Spinner />
    }

    if (!imgSrc) {
        console.error('Failed to fetch image:')
    }

    return (
        <img
            src={imgSrc}
            alt="img"
            width={width}
            height={height}
            className={className ?? ''}
            style={{
                minHeight: height,
                minWidth: width,
            }}
        />
    )
}
