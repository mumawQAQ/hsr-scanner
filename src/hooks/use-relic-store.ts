import { create } from 'zustand';

import { RelicMainStats, RelicRatingInfo, RelicSubStats } from '../types.ts';

import RelicUtils from '@/utils/relicRatingUtils.ts';

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

  relicRatingInfo: RelicRatingInfo | null;
  fetchRelicRatingInfo: () => Promise<any>;
  setRelicRatingInfo: (relicRatingInfo: RelicRatingInfo | null) => void;
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

  relicRatingInfo: null,
  fetchRelicRatingInfo: async () => {
    const relicTitle = get().relicTitle;
    const relicMainStatName = get().mainRelicStats?.name;
    if (!relicMainStatName || !relicTitle) {
      return;
    }
    return await RelicUtils.getRelicRatingInfo(relicTitle, relicMainStatName);
  },
  setRelicRatingInfo: relicRatingInfo => {
    set({ relicRatingInfo });
  },
}));

export default useRelicStore;
