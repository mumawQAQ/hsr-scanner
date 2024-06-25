import { create } from 'zustand';

import { RelicRulesTemplate } from '../../types.ts';

export type ModalType = 'create-relic-rules-template';

interface ModalData {
  relicRulesTemplate?: RelicRulesTemplate;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>(set => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
