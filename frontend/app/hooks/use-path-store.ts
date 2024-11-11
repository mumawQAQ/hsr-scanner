import { create } from 'zustand';

export type PathType = '/dashboard/relic-panel' | '/dashboard/relic-templates' | '/dashboard/setting';

type UsePathStore = {
  path: PathType | null;
  setPath: (type: PathType) => void;

  viewTemplateId: string | null;
  setViewTemplateId: (id: string) => void;
};

export const usePath = create<UsePathStore>(set => ({
  path: null,
  setPath: type =>
    set({
      path: type,
    }),

  viewTemplateId: null,
  setViewTemplateId: id =>
    set({
      viewTemplateId: id,
    }),
}));
