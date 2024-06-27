import { RelicRulesTemplate, RelicRulesTemplateStore } from '../types.ts';

import useRelicTemplateStore from '@/hooks/use-relic-template-store.ts';

const getAllRelicRulesTemplates = async (): Promise<RelicRulesTemplateStore> => {
  const templates = await (window as any).ipcRenderer.storeGet(`data.relicRulesTemplates`);

  // update relicRulesTemplateStore
  useRelicTemplateStore.setState({ relicRulesTemplateStore: templates });

  return templates as RelicRulesTemplateStore;
};

const addRelicRulesTemplate = async (
  templateId: string,
  relicRulesTemplate: RelicRulesTemplate
): Promise<{
  success: boolean;
  message: string;
}> => {
  // get all relicRulesTemplates
  const relicRulesTemplates = useRelicTemplateStore.getState().relicRulesTemplateStore;

  if (!relicRulesTemplates) {
    return {
      success: false,
      message: '无法找到当前遗器模板，请向Github提交issue',
    };
  }

  // add new relicRulesTemplate
  relicRulesTemplates[templateId] = relicRulesTemplate;

  // save relicRulesTemplates
  await (window as any).ipcRenderer.storeSet(`data.relicRulesTemplates`, relicRulesTemplates);

  // update relicRulesTemplateStore
  useRelicTemplateStore.setState({ relicRulesTemplateStore: relicRulesTemplates });

  return {
    success: true,
    message: '成功添加遗器模板',
  };
};

const removeRelicRulesTemplate = async (templateId: string): Promise<{ success: boolean; message: string }> => {
  // get all relicRulesTemplates
  const relicRulesTemplates = useRelicTemplateStore.getState().relicRulesTemplateStore;

  if (!relicRulesTemplates) {
    return {
      success: false,
      message: '无法找到当前遗器模板，请向Github提交issue',
    };
  }

  // remove relicRulesTemplate
  delete relicRulesTemplates[templateId];

  // save relicRulesTemplates
  await (window as any).ipcRenderer.storeSet(`data.relicRulesTemplates`, relicRulesTemplates);

  // update relicRulesTemplateStore
  useRelicTemplateStore.setState({ relicRulesTemplateStore: relicRulesTemplates });

  return {
    success: true,
    message: '成功删除遗器模板',
  };
};

export { getAllRelicRulesTemplates, addRelicRulesTemplate, removeRelicRulesTemplate };
