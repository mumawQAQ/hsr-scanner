import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import useRelicTemplateStore from '@/hooks/use-relic-template-store.ts';

type RelicRuleTemplateCardProps = {
  name: string;
  description: string;
  templateID: string;
};

const RelicRuleTemplateCard = ({ name, description, templateID }: RelicRuleTemplateCardProps) => {
  const { setCurrentRelicRatingRulesTemplate, relicRatingRulesTemplateStore } = useRelicTemplateStore();
  const navigate = useNavigate();

  if (!relicRatingRulesTemplateStore) {
    return null;
  }

  if (!relicRatingRulesTemplateStore[templateID]) {
    return null;
  }

  return (
    <Card
      className="h-fit cursor-pointer hover:ring hover:ring-offset-1"
      onClick={() => {
        // set the current template
        setCurrentRelicRatingRulesTemplate(relicRatingRulesTemplateStore[templateID]);

        navigate(`createEdit/${templateID}`);
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
