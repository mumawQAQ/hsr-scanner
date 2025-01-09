import { create } from 'zustand';

type WindowStore = {
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
