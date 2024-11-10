import { create } from 'zustand';

type WindowStore = {
  singleRelicAnalysisId: string | null;
  setSingleRelicAnalysisId: (id: string | null) => void;

  isLightMode: boolean;
  setIsLightMode: (mode: boolean) => void;

  logPause: boolean;
  setLogPause: (pause: boolean) => void;

  fullLog: boolean;
  setFullLog: (full: boolean) => void;

  topWindow: boolean;
  setTopWindow: (top: boolean) => void;
};

const useWindowStore = create<WindowStore>(set => ({
  singleRelicAnalysisId: null,
  setSingleRelicAnalysisId: id => set({ singleRelicAnalysisId: id }),

  isLightMode: false, // Default light mode
  setIsLightMode: mode => set({ isLightMode: mode }),

  logPause: false,
  setLogPause: pause => set({ logPause: pause }),

  fullLog: false,
  setFullLog: full => set({ fullLog: full }),

  topWindow: false,
  setTopWindow: top => set({ topWindow: top }),
}));

export default useWindowStore;
