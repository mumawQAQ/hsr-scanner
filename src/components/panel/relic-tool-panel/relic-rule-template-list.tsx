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
      {
        // if the template store is empty
        Object.keys(relicRatingRulesTemplateStore).length === 0 && (
          <div className="col-span-4 mt-10 items-center text-center text-lg font-extrabold">
            <div>暂无遗器模板</div>
            <div>请点击右上角按钮创建或导入新模板</div>
          </div>
        )
      }
    </div>
  );
};

export default RelicRuleTemplateList;
