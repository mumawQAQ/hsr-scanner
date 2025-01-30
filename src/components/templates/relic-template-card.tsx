import { RelicTemplate } from '@/types/relic-template-types'
import { cn } from '@/lib/utils.ts'
import { Card, CardContent, CardFooter } from '@/components/ui/card.tsx'
import { Eye, UserCircle } from 'lucide-react'

type RelicTemplateCardProps = {
    template: RelicTemplate
    setViewTemplateId: (templateId: string) => void
}

export default function RelicTemplateCard({ template, setViewTemplateId }: RelicTemplateCardProps) {
    const handleSelectTemplate = () => {
        setViewTemplateId(template.id)
    }

    return (
        <Card
            className={cn(
                'group relative h-[18rem] w-[14rem] transition-all duration-300 ease-in-out',
                'hover:scale-105 hover:shadow-lg cursor-pointer',
                template.in_use && 'border-primary/60 border-2'
            )}
            onClick={handleSelectTemplate}
        >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-5 h-5 text-muted-foreground" />
            </div>

            <CardContent className="pt-6 flex items-center justify-center text-center">
                <div className="flex flex-col gap-4 items-center">
                    <div>
                        <div className="font-semibold text-lg line-clamp-1 mb-1">{template.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">{template.description}</div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="absolute bottom-0 w-full justify-center pb-4">
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <UserCircle className="w-4 h-4" />
                    {template.author}
                </div>
            </CardFooter>
        </Card>
    )
}
