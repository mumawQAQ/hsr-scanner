import { create } from 'zustand';

type UseConfigStore = {
  // auto scan config
  autoScanDetectDiscardIcon: boolean
  setAutoScanDetectDiscardIcon: (autoScanDetectDiscardIcon: boolean) => void

  discardIconX: number | null
  setDiscardIconX: (discardIconX: number | null) => void

  discardIconY: number | null
  setDiscardIconY: (discardIconY: number | null) => void

  autoScanConfigSkipOnFail: boolean
  setAutoScanConfigSkipOnFail: (autoScanConfigPassOnFail: boolean) => void
  autoScanConfigDiscardScore: number
  setAutoScanConfigDiscardScore: (autoScanConfigDiscardScore: number) => void


}


export const useConfig = create<UseConfigStore>(set => ({
  // auto scan config

  autoScanDetectDiscardIcon: false,
  setAutoScanDetectDiscardIcon: (autoScanDetectDiscardIcon: boolean) => {
    set({ autoScanDetectDiscardIcon: autoScanDetectDiscardIcon });
  },

  discardIconX: null,
  setDiscardIconX: (discardIconX: number | null) => {
    set({ discardIconX: discardIconX });
  },

  discardIconY: null,
  setDiscardIconY: (discardIconY: number | null) => {
    set({ discardIconY: discardIconY });
  },

  autoScanConfigSkipOnFail: false,
  setAutoScanConfigSkipOnFail: (autoScanConfigPassOnFail: boolean) => {
    set({ autoScanConfigSkipOnFail: autoScanConfigPassOnFail });
  },
  autoScanConfigDiscardScore: 40,
  setAutoScanConfigDiscardScore: (autoScanConfigDiscardScore: number) => {
    set({ autoScanConfigDiscardScore: autoScanConfigDiscardScore });
  },

}));
