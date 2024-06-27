import RelicRuleTemplateCard from '@/components/panel/relic-tool-panel/relic-rule-template-card.tsx';

const RelicRuleTemplateList = () => {
  return (
    <div className="grid grid-cols-4 gap-4 overflow-y-auto px-2 py-2">
      <RelicRuleTemplateCard
        name={'模板1'}
        description={
          '式佑更芸欧技治矛表失技情文転再。子記以摘職室禁二質提直水成月保前。了結私外経夜強立石太活張人阪話児区代外。写面属覧青水設孤州表今台準輪目並東果事。歳幼毎森捕間急経職日品認香人八田。億通聞解空屋乳子足明米肺写聞護権調。標全加物備学情匿何倹三留冨希'
        }
      />
      <RelicRuleTemplateCard name={'1'} description={'sdadsa'} />
    </div>
  );
};

export default RelicRuleTemplateList;
