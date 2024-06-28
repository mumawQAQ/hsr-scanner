import { useParams } from 'react-router-dom';

import RelicRuleCard from '@/components/panel/relic-tool-panel/relic-rule-card.tsx';
import RelicRuleEmptyCard from '@/components/panel/relic-tool-panel/relic-rule-empty-card.tsx';
import useRelicTemplateStore from '@/hooks/use-relic-template-store.ts';

const RelicRuleCreate = () => {
  const { templateId } = useParams();
  const { currentRelicRatingRulesTemplate } = useRelicTemplateStore();

  if (!templateId) {
    return null;
  }

  return (
    <div className={'grid min-h-[800px] grid-cols-3 gap-4 overflow-y-auto px-2 py-2'}>
      {currentRelicRatingRulesTemplate?.rules &&
        Object.entries(currentRelicRatingRulesTemplate.rules).map(([ruleId, rule]) => (
          <RelicRuleCard key={ruleId} templateId={templateId} ruleId={ruleId} rule={rule} />
        ))}
      <RelicRuleEmptyCard templateId={templateId} />
    </div>
  );
};

export default RelicRuleCreate;
