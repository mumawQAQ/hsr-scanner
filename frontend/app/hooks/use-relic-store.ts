import { create } from 'zustand';
import { RelicInfo, RelicScore } from '@/app/types/relic-types';

type UseRelicStore = {
  relicInfo: RelicInfo | null;
  relicError: string | null;
  relicScores: RelicScore[] | null;
};

const useRelicStore = create<UseRelicStore>(() => ({
  relicInfo: null,
  relicError: null,
  relicScores: null,
}));

export default useRelicStore;
