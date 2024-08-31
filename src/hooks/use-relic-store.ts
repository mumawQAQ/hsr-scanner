import { create } from 'zustand';

import { RelicImage, RelicInfo } from '../type/types.ts';

type UseRelicStore = {
  relicInfo: RelicInfo | null;
  relicImage: RelicImage | null;
  relicError: string | null;
};

const useRelicStore = create<UseRelicStore>(() => ({
  relicInfo: null,
  relicError: null,
  relicImage: null,
}));

export default useRelicStore;
