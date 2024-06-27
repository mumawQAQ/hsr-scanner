import RelicRuleCard from '@/components/panel/relic-tool-panel/relic-rule-card.tsx';

const RelicRuleEdit = () => {
  // const { templateId } = useParams();

  return (
    <div className={'grid min-h-[800px] grid-cols-3 gap-4 overflow-y-auto px-2 py-2'}>
      <RelicRuleCard ruleId={'1'} />
      <RelicRuleCard ruleId={'1'} />
    </div>
  );
};

export default RelicRuleEdit;
