import { create } from 'zustand';

type WindowStore = {
  scanningStatus: boolean;
  setScanningStatus: (status: boolean) => void;
  scanInterval: number;
  setScanInterval: (interval: number) => void;
  isLightMode: boolean;
  toggleWindowMode: () => void;
};

const useWindowStore = create<WindowStore>((set, get) => ({
  scanningStatus: false, // Default status
  setScanningStatus: (status) => set({ scanningStatus: status }),

  scanInterval: 2000, // Default interval in ms
  setScanInterval: (interval) => set({ scanInterval: interval }),

  isLightMode: false, // Default light mode
  toggleWindowMode: () => {
    const newMode = !get().isLightMode;
    set({ isLightMode: newMode });
    (window as any).ipcRenderer?.changeWindowMode(newMode);
  }
}));

export default useWindowStore;
