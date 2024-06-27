import { create } from 'zustand';

import { RatingRule, RatingTemplate, RatingTemplateStore } from '../types.ts';

import {
  createRelicRatingRule,
  createRelicRulesTemplate,
  getAllRelicRulesTemplates,
  removeRelicRulesTemplate,
} from '@/utils/relicRulesTemplateUtils.ts';

type RelicTemplateStore = {
  relicRatingRulesTemplateStore: RatingTemplateStore | null;

  fetchRelicRatingRulesTemplateStore: () => Promise<void>;

  createRelicRatingRulesTemplate: (
    templateId: string,
    relicRulesTemplate: RatingTemplate
  ) => Promise<{
    success: boolean;
    message: string;
  }>;

  removeRelicRatingRulesTemplate: (templateId: string) => Promise<{ success: boolean; message: string }>;

  currentRelicRatingRulesTemplate: RatingTemplate | null;

  setCurrentRelicRatingRulesTemplate: (template: RatingTemplate) => void;

  createRelicRatingRule: (
    templateId: string,
    ruleId: string,
    rule: RatingRule
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

  createRelicRatingRulesTemplate: async (templateId, relicRulesTemplate) => {
    return await createRelicRulesTemplate(templateId, relicRulesTemplate);
  },

  removeRelicRatingRulesTemplate: async templateId => {
    return await removeRelicRulesTemplate(templateId);
  },

  currentRelicRatingRulesTemplate: null,

  setCurrentRelicRatingRulesTemplate: template => {
    set({ currentRelicRatingRulesTemplate: template });
  },

  createRelicRatingRule: async (templateId, ruleId, rule) => {
    return await createRelicRatingRule(templateId, ruleId, rule);
  },
}));

useRelicTemplateStore.getState().fetchRelicRatingRulesTemplateStore();

export default useRelicTemplateStore;
