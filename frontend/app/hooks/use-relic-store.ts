import { create } from 'zustand';
import { RelicImage, RelicInfo, RelicScore } from '@/app/types/relic-types';

type UseRelicStore = {
  relicInfo: RelicInfo | null;
  relicImage: RelicImage | null;
  relicError: string | null;
  relicScores: RelicScore[] | null;
};

const useRelicStore = create<UseRelicStore>(() => ({
  relicInfo: null,
  relicError: null,
  relicImage: null,
  relicScores: null,
}));

export default useRelicStore;
