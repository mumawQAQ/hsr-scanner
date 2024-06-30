import ElectronStore from 'electron-store';

import { RatingTemplateStore } from '@/type/types.ts';

interface StoreData {
  ratingTemplates: RatingTemplateStore;
}

const store = new ElectronStore<StoreData>({
  defaults: {
    ratingTemplates: {},
  },
});

export default store;
