'use client';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Button } from '@nextui-org/button';

type RelicRuleCardProps = {
  ruleId: string;
  characters: string[];
};

export default function RelicRuleCard({ ruleId, characters }: RelicRuleCardProps) {
  return (
    <Card className="min-h-[15rem] w-full">
      <CardBody className="flex items-center justify-center text-center">
        <div className="flex flex-col gap-3">
          <div className="line-clamp-1 font-semibold">{ruleId}</div>
          <div className="text-tiny line-clamp-2 font-light">{characters.join(', ')}</div>
        </div>
      </CardBody>
      <CardFooter className="flex justify-end gap-2">
        <Button size="sm" variant="bordered" color="default">
          保存
        </Button>
        <Button size="sm" variant="bordered" color="danger">
          删除
        </Button>
      </CardFooter>
    </Card>
  );
}
