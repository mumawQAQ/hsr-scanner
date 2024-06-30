import { contextBridge, ipcRenderer } from 'electron';

import { RatingRule, RatingTemplate } from '@/type/types.ts';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  // You can expose other APTs you need here.
  // ...
  captureScreen() {
    return ipcRenderer.invoke('capture-screen');
  },

  storeGet(key: string) {
    return ipcRenderer.invoke('store-get', key);
  },

  storeSet(key: string, value: any) {
    return ipcRenderer.invoke('store-set', key, value);
  },

  storeDeleteRatingTemplate(templateId: string) {
    return ipcRenderer.invoke('store-delete-rating-template', templateId);
  },

  storeUpdateAddRatingTemplate(templateId: string, template: RatingTemplate) {
    return ipcRenderer.invoke('store-update-add-rating-template', templateId, template);
  },

  storeDeleteRatingRule(templateId: string, ruleId: string) {
    return ipcRenderer.invoke('store-delete-rating-rule', templateId, ruleId);
  },

  storeUpdateAddRatingRule(templateId: string, ruleId: string, rule: RatingRule) {
    return ipcRenderer.invoke('store-update-add-rating-rule', templateId, ruleId, rule);
  },

  updateNow() {
    return ipcRenderer.invoke('update-now');
  },

  changeWindowMode(mode: boolean) {
    ipcRenderer.send('change-window-mode', mode);
  },
  exportRelicRulesTemplate(template: RatingTemplate) {
    ipcRenderer.send('export-relic-rules-template', template);
  },
});
