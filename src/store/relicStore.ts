import { create } from 'zustand';

import { RelicMainStats, RelicRatingInfo, RelicSubStats } from '../../types.ts';

import RelicUtils from '@/utils/relicUtils.ts';

type RelicStore = {
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

const useRelicStore = create<RelicStore>((set, get) => ({
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
    const relicRatingInfo = await RelicUtils.getRelicRatingInfo(relicTitle, relicMainStatName);
    set({ relicRatingInfo });
    return relicRatingInfo;
  },
  setRelicRatingInfo: relicRatingInfo => {
    set({ relicRatingInfo });
  },
}));

export default useRelicStore;
