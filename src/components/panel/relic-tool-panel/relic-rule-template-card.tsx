import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type RelicRuleTemplateCardProps = {
  name: string;
  description: string;
};

const RelicRuleTemplateCard = ({ name, description }: RelicRuleTemplateCardProps) => {
  const navigate = useNavigate();
  const templateID = '1';

  return (
    <Card
      className="h-fit cursor-pointer hover:ring hover:ring-offset-1"
      onClick={() => {
        navigate(`edit/${templateID}`);
      }}
    >
      <CardHeader className="relative">
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>

        <button
          className="absolute right-2 top-0 rounded-full bg-rose-500 p-0.5 text-white shadow-sm"
          onClick={e => {
            e.stopPropagation();
            console.log('X clicked');
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </CardHeader>
    </Card>
  );
};

export default RelicRuleTemplateCard;
