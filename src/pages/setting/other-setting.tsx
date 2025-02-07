import { Card, CardContent } from '@/components/ui/card.tsx'

const OtherSetting = () => {
    return (
        <>
            <div className="text-medium font-semibold">其他设置</div>
            <Card className="pt-5 px-2 shadow-lg rounded-lg">
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-row items-center"></div>
                </CardContent>
            </Card>
        </>
    )
}

export default OtherSetting
