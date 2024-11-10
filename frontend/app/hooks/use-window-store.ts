import { create } from 'zustand';

type WindowStore = {
  scanningStatus: boolean;
  setScanningStatus: (status: boolean) => void;

  isLightMode: boolean;
  setIsLightMode: (mode: boolean) => void;

  imgShow: boolean;
  setImageShow: (show: boolean) => void;

  logPause: boolean;
  setLogPause: (pause: boolean) => void;

  fullLog: boolean;
  setFullLog: (full: boolean) => void;

  topWindow: boolean;
  setTopWindow: (top: boolean) => void;
};

const useWindowStore = create<WindowStore>(set => ({
  scanningStatus: true,
  setScanningStatus: status => {
    // set request to backend
    set({ scanningStatus: status });
  },

  isLightMode: false, // Default light mode
  setIsLightMode: mode => set({ isLightMode: mode }),

  imgShow: false, // Default image show
  setImageShow: show => set({ imgShow: show }),

  logPause: false,
  setLogPause: pause => set({ logPause: pause }),

  fullLog: false,
  setFullLog: full => set({ fullLog: full }),

  topWindow: false,
  setTopWindow: top => set({ topWindow: top }),
}));

export default useWindowStore;
