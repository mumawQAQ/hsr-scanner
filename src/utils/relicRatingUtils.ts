import { PartNameToSetNameMapping } from '@/data/relic-parts-data.ts';
import useRelicTemplateStore from '@/hooks/use-relic-template-store.ts';
import { RatingRule } from '@/type/types.ts';

const getRelicRatingRules = (relicTitle: string, relicMainStat: string) => {
  // get the current rating template
  const relicRulesTemplates = useRelicTemplateStore.getState().currentRelicRatingRulesTemplate;

  if (!relicRulesTemplates) {
    return {
      success: false,
      message: '暂未指定遗器规则模板，请先导入模板并使用模板',
      rules: [],
    };
  }

  // get the set name base on the relic title
  const setName = PartNameToSetNameMapping[relicTitle];

  const validRules: RatingRule[] = [];

  // base on the template, get all the rules that match the relic title and relic main stat
  Object.values(relicRulesTemplates.rules).forEach(rule => {
    // first need to make sure the rule is valid for the current relic set
    if (rule.setNames.includes(setName)) {
      // check if the relic main stat and relic part name match the rule
      if (rule.partNames[relicTitle] && rule.partNames[relicTitle].valuableMain.includes(relicMainStat)) {
        validRules.push(rule);
      }
    }
  });

  return {
    success: true,
    message: '成功获取遗器评分规则',
    rules: validRules,
  };
};

export default {
  getRelicRatingRules,
};
