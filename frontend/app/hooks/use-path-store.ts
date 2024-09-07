import { create } from 'zustand';

export type PathType = '/dashboard/relic-panel' | '/dashboard/relic-templates';

type UsePathStore = {
  path: PathType | null;
  setPath: (type: PathType) => void;
};

export const usePath = create<UsePathStore>(set => ({
  path: null,
  setPath: type =>
    set({
      path: type,
    }),
}));
