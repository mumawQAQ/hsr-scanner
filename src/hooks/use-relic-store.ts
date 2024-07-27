import { create } from 'zustand';

import { RelicInfo } from '../type/types.ts';

type UseRelicStore = {
  relicInfo: RelicInfo | null;
  relicError: string | null;
};

const useRelicStore = create<UseRelicStore>(() => ({
  relicInfo: null,
  relicError: null,
}));

export default useRelicStore;
