import { create } from 'zustand';

import { RatingTemplate, RatingTemplateStore } from '../types.ts';

import {
  addRelicRulesTemplate,
  getAllRelicRulesTemplates,
  removeRelicRulesTemplate,
} from '@/utils/relicRulesTemplateUtils.ts';

type RelicTemplateStore = {
  relicRulesTemplateStore: RatingTemplateStore | null;
  fetchRelicRulesTemplateStore: () => Promise<void>;
  addRelicRulesTemplate: (
    templateId: string,
    relicRulesTemplate: RatingTemplate
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
  removeRelicRulesTemplate: (templateId: string) => Promise<{ success: boolean; message: string }>;
};

export const useRelicTemplateStore = create<RelicTemplateStore>((set, get) => ({
  relicRulesTemplateStore: null,

  fetchRelicRulesTemplateStore: async () => {
    await getAllRelicRulesTemplates();
  },

  addRelicRulesTemplate: async (templateId, relicRulesTemplate) => {
    return await addRelicRulesTemplate(templateId, relicRulesTemplate);
  },

  removeRelicRulesTemplate: async templateId => {
    return await removeRelicRulesTemplate(templateId);
  },
}));

useRelicTemplateStore.getState().fetchRelicRulesTemplateStore();

export default useRelicTemplateStore;
