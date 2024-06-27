import { useParams } from 'react-router-dom';

import RelicRuleCard from '@/components/panel/relic-tool-panel/relic-rule-card.tsx';
import RelicRuleEmptyCard from '@/components/panel/relic-tool-panel/relic-rule-empty-card.tsx';

const RelicRuleCreate = () => {
  const { templateId } = useParams();

  if (!templateId) {
    return null;
  }

  return (
    <div className={'grid min-h-[800px] grid-cols-3 gap-4 overflow-y-auto px-2 py-2'}>
      <RelicRuleCard ruleId={'1'} />
      <RelicRuleEmptyCard templateId={templateId} />
    </div>
  );
};

export default RelicRuleCreate;
