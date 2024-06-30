import { create } from 'zustand';

import { RelicMainStats, RelicSubStats } from '../type/types.ts';

type UseRelicStore = {
  relicTitle: string;
  getRelicTitle: () => string;
  setRelicTitle: (relicTitle: string) => void;

  mainRelicStats: RelicMainStats | null;
  getMainRelicStats: () => RelicMainStats | null;
  setMainRelicStats: (mainRelicStats: RelicMainStats | null) => void;

  subRelicStats: RelicSubStats[] | [];
  getSubRelicStats: () => RelicSubStats[] | [];
  setSubRelicStats: (subRelicStats: RelicSubStats[]) => void;
};

const useRelicStore = create<UseRelicStore>((set, get) => ({
  relicTitle: '',
  getRelicTitle: () => {
    return get().relicTitle;
  },
  setRelicTitle: relicTitle => {
    set({ relicTitle });
  },

  mainRelicStats: null,
  getMainRelicStats: () => {
    return get().mainRelicStats;
  },
  setMainRelicStats: mainRelicStats => {
    set({ mainRelicStats });
  },

  subRelicStats: [],
  getSubRelicStats: () => {
    return get().subRelicStats;
  },
  setSubRelicStats: subRelicStats => {
    set({ subRelicStats });
  },
}));

export default useRelicStore;
