import { RatingRule, RatingTemplate, RatingTemplateStore } from '../types.ts';

import useRelicTemplateStore from '@/hooks/use-relic-template-store.ts';

const getAllRelicRulesTemplates = async (): Promise<RatingTemplateStore> => {
  const templates = await (window as any).ipcRenderer.storeGet(`ratingTemplates`);

  // update relicRulesTemplateStore
  useRelicTemplateStore.setState({ relicRatingRulesTemplateStore: templates });

  return templates as RatingTemplateStore;
};

const createOrUpdateRelicRulesTemplate = async (
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
      message: 'zustand创建或移除遗器模板时，无法找到模板储存，请向Github提交issue',
    };
  }

  // add new relicRulesTemplate
  relicRulesTemplates[templateId] = relicRulesTemplate;

  // save relicRulesTemplates
  const result = await (window as any).ipcRenderer.storeUpdateAddRatingTemplate(templateId, relicRulesTemplate);

  if (!result.success) {
    return result;
  }

  // update relicRulesTemplateStore
  useRelicTemplateStore.setState({
    relicRatingRulesTemplateStore: relicRulesTemplates,
    currentRelicRatingRulesTemplate: relicRulesTemplate,
  });

  return result;
};

const removeRelicRulesTemplate = async (templateId: string): Promise<{ success: boolean; message: string }> => {
  // get all relicRulesTemplates
  const relicRulesTemplates = useRelicTemplateStore.getState().relicRatingRulesTemplateStore;

  if (!relicRulesTemplates) {
    return {
      success: false,
      message: 'zustand移除遗器模板时，无法找到模板储存，请向Github提交issue',
    };
  }

  // remove relicRulesTemplate
  delete relicRulesTemplates[templateId];

  // save relicRulesTemplates
  const result = await (window as any).ipcRenderer.storeDeleteRatingTemplate(templateId);

  if (!result.success) {
    return result;
  }

  // update relicRulesTemplateStore
  useRelicTemplateStore.setState({ relicRatingRulesTemplateStore: relicRulesTemplates });

  return result;
};

const createOrUpdateRelicRatingRule = async (
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
      message: 'zustand创建或更新遗器规则时，无法找到当前遗器模板，请向Github提交issue',
    };
  }

  // add new relicRatingRule
  relicRulesTemplates[templateId].rules[ruleId] = rule;
  currentRelicRulesTemplate.rules[ruleId] = rule;

  // save relicRulesTemplates
  const result = await (window as any).ipcRenderer.storeUpdateAddRatingRule(templateId, ruleId, rule);

  if (!result.success) {
    return result;
  }

  useRelicTemplateStore.setState({
    relicRatingRulesTemplateStore: relicRulesTemplates,
    currentRelicRatingRulesTemplate: currentRelicRulesTemplate,
  });

  return result;
};

const removeRelicRatingRule = async (
  templateId: string,
  ruleId: string
): Promise<{ success: boolean; message: string }> => {
  // get all relicRulesTemplates
  const relicRulesTemplates = useRelicTemplateStore.getState().relicRatingRulesTemplateStore;

  // get current relicRulesTemplate
  const currentRelicRulesTemplate = useRelicTemplateStore.getState().currentRelicRatingRulesTemplate;

  if (!relicRulesTemplates || !currentRelicRulesTemplate) {
    return {
      success: false,
      message: 'zustand移除遗器规则时，无法找到当前遗器模板，请向Github提交issue',
    };
  }

  // remove relicRatingRule
  delete relicRulesTemplates[templateId].rules[ruleId];
  delete currentRelicRulesTemplate.rules[ruleId];

  // save relicRulesTemplates
  const result = await (window as any).ipcRenderer.storeDeleteRatingRule(templateId, ruleId);

  if (!result.success) {
    return result;
  }

  useRelicTemplateStore.setState({
    relicRatingRulesTemplateStore: relicRulesTemplates,
    currentRelicRatingRulesTemplate: currentRelicRulesTemplate,
  });

  return result;
};

export {
  getAllRelicRulesTemplates,
  createOrUpdateRelicRulesTemplate,
  removeRelicRulesTemplate,
  createOrUpdateRelicRatingRule,
  removeRelicRatingRule,
};
