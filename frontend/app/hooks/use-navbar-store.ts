import { ReactNode } from 'react';
import { create } from 'zustand';

type UseNavbarStore = {
  leftNavbar: ReactNode | null;
  setLeftNavbar: (leftNavbar: ReactNode) => void;

  rightNavbar: ReactNode | null;
  setRightNavbar: (rightNavbar: ReactNode) => void;

  clearCustomNavbar: () => void;
};

export const useNavbarStore = create<UseNavbarStore>(set => ({
  leftNavbar: null,
  setLeftNavbar: leftNavbar =>
    set({
      leftNavbar,
    }),

  rightNavbar: null,
  setRightNavbar: rightNavbar =>
    set({
      rightNavbar,
    }),

  clearCustomNavbar: () =>
    set({
      leftNavbar: null,
      rightNavbar: null,
    }),
}));
