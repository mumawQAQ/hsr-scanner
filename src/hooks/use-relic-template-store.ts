import { create } from 'zustand';

import { RatingRule, RatingTemplate, RatingTemplateStore } from '../type/types.ts';

import {
  createOrUpdateRelicRatingRule,
  createOrUpdateRelicRulesTemplate,
  getAllRelicRulesTemplates,
  removeRelicRatingRule,
  removeRelicRulesTemplate,
} from '@/utils/relicRulesTemplateUtils.ts';

type RelicTemplateStore = {
  relicRatingRulesTemplateStore: RatingTemplateStore | null;

  fetchRelicRatingRulesTemplateStore: () => Promise<void>;

  createOrUpdateRelicRatingRulesTemplate: (
    templateId: string,
    relicRulesTemplate: RatingTemplate
  ) => Promise<{
    success: boolean;
    message: string;
  }>;

  removeRelicRatingRulesTemplate: (templateId: string) => Promise<{ success: boolean; message: string }>;

  currentRelicRatingRulesTemplate: RatingTemplate | null;
  currentRelicRatingRulesTemplateId: string | null;

  setCurrentRelicRatingRulesTemplate: (template: RatingTemplate, templateId: string) => void;

  createOrUpdateRelicRatingRule: (
    templateId: string,
    ruleId: string,
    rule: RatingRule
  ) => Promise<{
    success: boolean;
    message: string;
  }>;

  removeRelicRatingRule: (
    templateId: string,
    ruleId: string
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
};

export const useRelicTemplateStore = create<RelicTemplateStore>(set => ({
  relicRatingRulesTemplateStore: null,

  fetchRelicRatingRulesTemplateStore: async () => {
    await getAllRelicRulesTemplates();
  },

  createOrUpdateRelicRatingRulesTemplate: async (templateId, relicRulesTemplate) => {
    return await createOrUpdateRelicRulesTemplate(templateId, relicRulesTemplate);
  },

  removeRelicRatingRulesTemplate: async templateId => {
    return await removeRelicRulesTemplate(templateId);
  },

  currentRelicRatingRulesTemplate: null,
  currentRelicRatingRulesTemplateId: null,

  setCurrentRelicRatingRulesTemplate: (template, templateId) => {
    set({ currentRelicRatingRulesTemplate: template, currentRelicRatingRulesTemplateId: templateId });
  },

  createOrUpdateRelicRatingRule: async (templateId, ruleId, rule) => {
    return await createOrUpdateRelicRatingRule(templateId, ruleId, rule);
  },

  removeRelicRatingRule: async (templateId, ruleId) => {
    return await removeRelicRatingRule(templateId, ruleId);
  },
}));

useRelicTemplateStore.getState().fetchRelicRatingRulesTemplateStore();

export default useRelicTemplateStore;
