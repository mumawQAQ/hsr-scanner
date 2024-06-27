import { create } from 'zustand';

import { RatingTemplate, RatingTemplateStore } from '../types.ts';

import {
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
}));

useRelicTemplateStore.getState().fetchRelicRatingRulesTemplateStore();

export default useRelicTemplateStore;
