import { create } from 'zustand';

type WindowStore = {
  scanningStatus: boolean;
  setScanningStatus: (status: boolean) => void;

  isLightMode: boolean;

  imgShow: boolean;
  setImageShow: (show: boolean) => void;

  logPause: boolean;
  setLogPause: (pause: boolean) => void;
};

const useWindowStore = create<WindowStore>(set => ({
  scanningStatus: false,
  setScanningStatus: status => {
    // set request to backend
    set({ scanningStatus: status });
  },

  isLightMode: false, // Default light mode

  imgShow: false, // Default image show
  setImageShow: show => set({ imgShow: show }),

  logPause: false,
  setLogPause: pause => set({ logPause: pause }),
}));

export default useWindowStore;
