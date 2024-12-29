import { create } from 'zustand';
import { RelicInfo, RelicScore } from '@/app/types/relic-types';

type UseRelicStore = {
  relicInfo: RelicInfo | null;
  relicScores: RelicScore[] | null;
};

const useRelicStore = create<UseRelicStore>(() => ({
  relicInfo: null,
  relicScores: null,
}));

export default useRelicStore;
