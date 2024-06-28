import RelicRuleTemplateCard from '@/components/panel/relic-tool-panel/relic-rule-template-card.tsx';
import useRelicTemplateStore from '@/hooks/use-relic-template-store.ts';

const RelicRuleTemplateList = () => {
  const { relicRatingRulesTemplateStore } = useRelicTemplateStore();

  if (!relicRatingRulesTemplateStore) {
    return null;
  }

  return (
    <div className="grid grid-cols-4 gap-4 overflow-y-auto px-2 py-2">
      {Object.entries(relicRatingRulesTemplateStore).map(([templateId, template]) => (
        <RelicRuleTemplateCard
          key={templateId}
          name={template.templateName}
          description={template.templateDescription}
          templateID={templateId}
        />
      ))}
    </div>
  );
};

export default RelicRuleTemplateList;
