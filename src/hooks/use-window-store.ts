import { create } from 'zustand';

type WindowStore = {
  scanningStatus: boolean;
  setScanningStatus: (status: boolean) => void;
  scanInterval: number;
  setScanInterval: (interval: number) => void;
  isLightMode: boolean;
  toggleWindowMode: () => void;
  imgShow: boolean;
  setImageShow: (show: boolean) => void;
};

const useWindowStore = create<WindowStore>((set, get) => ({
  scanningStatus: false, // Default status
  setScanningStatus: status => {
    // set request to backend
    set({ scanningStatus: status });
  },

  scanInterval: 2000, // Default interval in ms
  setScanInterval: interval => set({ scanInterval: interval }),

  isLightMode: false, // Default light mode
  toggleWindowMode: () => {
    const newMode = !get().isLightMode;
    set({ isLightMode: newMode });
    (window as any).ipcRenderer?.changeWindowMode(newMode);
  },

  imgShow: false, // Default image show
  setImageShow: show => set({ imgShow: show }),
}));

export default useWindowStore;
