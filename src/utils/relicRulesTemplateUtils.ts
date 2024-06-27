import { RatingRule, RatingTemplate, RatingTemplateStore } from '../types.ts';

import useRelicTemplateStore from '@/hooks/use-relic-template-store.ts';

const getAllRelicRulesTemplates = async (): Promise<RatingTemplateStore> => {
  const templates = await (window as any).ipcRenderer.storeGet(`data.ratingTemplates`);

  // update relicRulesTemplateStore
  useRelicTemplateStore.setState({ relicRatingRulesTemplateStore: templates });

  return templates as RatingTemplateStore;
};

const createRelicRulesTemplate = async (
  templateId: string,
  relicRulesTemplate: RatingTemplate
): Promise<{
  success: boolean;
  message: string;
}> => {
  // get all relicRulesTemplates
  const relicRulesTemplates = useRelicTemplateStore.getState().relicRatingRulesTemplateStore;

  if (!relicRulesTemplates) {
    return {
      success: false,
      message: '无法找到模板储存，请向Github提交issue',
    };
  }

  // add new relicRulesTemplate
  relicRulesTemplates[templateId] = relicRulesTemplate;

  // save relicRulesTemplates
  await (window as any).ipcRenderer.storeSet(`data.ratingTemplates`, relicRulesTemplates);

  // update relicRulesTemplateStore
  useRelicTemplateStore.setState({
    relicRatingRulesTemplateStore: relicRulesTemplates,
    currentRelicRatingRulesTemplate: relicRulesTemplate,
  });

  return {
    success: true,
    message: '成功创建遗器模板',
  };
};

const removeRelicRulesTemplate = async (templateId: string): Promise<{ success: boolean; message: string }> => {
  // get all relicRulesTemplates
  const relicRulesTemplates = useRelicTemplateStore.getState().relicRatingRulesTemplateStore;

  if (!relicRulesTemplates) {
    return {
      success: false,
      message: '无法找到当前遗器模板，请向Github提交issue',
    };
  }

  // remove relicRulesTemplate
  delete relicRulesTemplates[templateId];

  // save relicRulesTemplates
  await (window as any).ipcRenderer.storeSet(`data.ratingTemplates`, relicRulesTemplates);

  // update relicRulesTemplateStore
  useRelicTemplateStore.setState({ relicRatingRulesTemplateStore: relicRulesTemplates });

  return {
    success: true,
    message: '成功删除遗器模板',
  };
};

const createRelicRatingRule = async (
  templateId: string,
  ruleId: string,
  rule: RatingRule
): Promise<{ success: boolean; message: string }> => {
  // get all relicRulesTemplates
  const relicRulesTemplates = useRelicTemplateStore.getState().relicRatingRulesTemplateStore;

  // get current relicRulesTemplate
  const currentRelicRulesTemplate = useRelicTemplateStore.getState().currentRelicRatingRulesTemplate;

  if (!relicRulesTemplates || !currentRelicRulesTemplate) {
    return {
      success: false,
      message: '无法找到当前遗器模板，请向Github提交issue',
    };
  }

  // add new relicRatingRule
  relicRulesTemplates[templateId].rules[ruleId] = rule;
  currentRelicRulesTemplate.rules[ruleId] = rule;

  // save relicRulesTemplates
  await (window as any).ipcRenderer.storeSet(`data.ratingTemplates`, relicRulesTemplates);

  useRelicTemplateStore.setState({
    relicRatingRulesTemplateStore: relicRulesTemplates,
    currentRelicRatingRulesTemplate: currentRelicRulesTemplate,
  });

  return {
    success: true,
    message: '成功创建遗器规则',
  };
};

export { getAllRelicRulesTemplates, createRelicRulesTemplate, removeRelicRulesTemplate, createRelicRatingRule };
