import { X } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import useRelicTemplateStore from '@/hooks/use-relic-template-store.ts';
import { cn } from '@/lib/utils.ts';

type RelicRuleTemplateCardProps = {
  name: string;
  description: string;
  templateID: string;
  currentTemplateID: string | null;
};

const RelicRuleTemplateCard = ({ name, description, templateID, currentTemplateID }: RelicRuleTemplateCardProps) => {
  const { setCurrentRelicRatingRulesTemplate, relicRatingRulesTemplateStore, removeRelicRatingRulesTemplate } =
    useRelicTemplateStore();
  const navigate = useNavigate();

  if (!relicRatingRulesTemplateStore) {
    return null;
  }

  if (!relicRatingRulesTemplateStore[templateID]) {
    return null;
  }

  const handleDeleteTemplate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await removeRelicRatingRulesTemplate(templateID);

    if (!result.success) {
      toast(result.message, { type: 'error' });
    }
  };

  return (
    <Card
      className={cn(
        'h-fit cursor-pointer transition-all duration-200 ease-in-out hover:shadow-lg hover:ring hover:ring-offset-1',
        templateID === currentTemplateID ? 'border-2 border-green-700' : ''
      )}
      onClick={() => {
        // set the current template
        setCurrentRelicRatingRulesTemplate(relicRatingRulesTemplateStore[templateID], templateID);

        navigate(`createEdit/${templateID}`);
      }}
    >
      <CardHeader className="relative">
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>

        <button
          className="absolute right-2 top-0 rounded-full bg-rose-500 p-0.5 text-white shadow-sm"
          onClick={e => {
            handleDeleteTemplate(e);
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </CardHeader>
    </Card>
  );
};

export default RelicRuleTemplateCard;
