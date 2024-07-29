import { create } from 'zustand';

export type ModalType =
  | 'create-relic-rules-template'
  | 'import-relic-rules-template'
  | 'export-relic-rules-template'
  | 'import-template-model'
  | 'update-modal'
  | 'install-requirement';

interface ModalData {
  updateMessage?: string;
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
