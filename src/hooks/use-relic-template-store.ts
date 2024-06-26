import { create } from 'zustand';

import { RelicRulesTemplate, RelicRulesTemplateStore } from '../../types.ts';

import {
  addRelicRulesTemplate,
  getAllRelicRulesTemplates,
  removeRelicRulesTemplate,
} from '@/utils/relicRulesTemplateUtils.ts';

type RelicTemplateStore = {
  relicRulesTemplateStore: RelicRulesTemplateStore | null;
  fetchRelicRulesTemplateStore: () => Promise<void>;
  addRelicRulesTemplate: (
    templateId: string,
    relicRulesTemplate: RelicRulesTemplate
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
  removeRelicRulesTemplate: (templateId: string) => Promise<{ success: boolean; message: string }>;

  relicTempRulesTemplateStore: RelicRulesTemplateStore;
  addRelicTempRulesTemplate: (
    templateId: string,
    relicRulesTemplate: RelicRulesTemplate
  ) => { success: boolean; message: string };
  removeRelicTempRulesTemplate: (templateId: string) => { success: boolean; message: string };
};

export const useRelicTemplateStore = create<RelicTemplateStore>((set, get) => ({
  relicRulesTemplateStore: null,
  relicTempRulesTemplateStore: {} as RelicRulesTemplateStore,

  fetchRelicRulesTemplateStore: async () => {
    await getAllRelicRulesTemplates();
  },

  addRelicRulesTemplate: async (templateId, relicRulesTemplate) => {
    return await addRelicRulesTemplate(templateId, relicRulesTemplate);
  },

  removeRelicRulesTemplate: async templateId => {
    return await removeRelicRulesTemplate(templateId);
  },

  addRelicTempRulesTemplate: (templateId, relicRulesTemplate) => {
    set({ relicTempRulesTemplateStore: { ...get().relicTempRulesTemplateStore, [templateId]: relicRulesTemplate } });
    return { success: true, message: 'success' };
  },

  removeRelicTempRulesTemplate: templateId => {
    // if the templateId does not exist, return error
    if (!get().relicTempRulesTemplateStore || !get().relicTempRulesTemplateStore[templateId]) {
      return { success: false, message: '模板不存在' };
    }

    // remove the template from the store
    const newRelicTempRulesTemplateStore = { ...get().relicTempRulesTemplateStore };
    delete newRelicTempRulesTemplateStore[templateId];
    set({ relicTempRulesTemplateStore: newRelicTempRulesTemplateStore });

    return { success: true, message: 'success' };
  },
}));

useRelicTemplateStore.getState().fetchRelicRulesTemplateStore();

export default useRelicTemplateStore;
