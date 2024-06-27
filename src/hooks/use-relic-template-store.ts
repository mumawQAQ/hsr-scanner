import { create } from 'zustand';

import { RatingTemplate, RatingTemplateStore } from '../types.ts';

import {
  createRelicRulesTemplate,
  getAllRelicRulesTemplates,
  removeRelicRulesTemplate,
} from '@/utils/relicRulesTemplateUtils.ts';

type RelicTemplateStore = {
  relicRulesTemplateStore: RatingTemplateStore | null;

  fetchRelicRulesTemplateStore: () => Promise<void>;

  createRelicRulesTemplate: (
    templateId: string,
    relicRulesTemplate: RatingTemplate
  ) => Promise<{
    success: boolean;
    message: string;
  }>;

  removeRelicRulesTemplate: (templateId: string) => Promise<{ success: boolean; message: string }>;

  currentRelicRulesTemplate: RatingTemplate | null;

  setCurrentRelicRulesTemplate: (template: RatingTemplate) => void;
};

export const useRelicTemplateStore = create<RelicTemplateStore>(set => ({
  relicRulesTemplateStore: null,

  fetchRelicRulesTemplateStore: async () => {
    await getAllRelicRulesTemplates();
  },

  createRelicRulesTemplate: async (templateId, relicRulesTemplate) => {
    return await createRelicRulesTemplate(templateId, relicRulesTemplate);
  },

  removeRelicRulesTemplate: async templateId => {
    return await removeRelicRulesTemplate(templateId);
  },

  currentRelicRulesTemplate: null,

  setCurrentRelicRulesTemplate: template => {
    set({ currentRelicRulesTemplate: template });
  },
}));

useRelicTemplateStore.getState().fetchRelicRulesTemplateStore();

export default useRelicTemplateStore;
