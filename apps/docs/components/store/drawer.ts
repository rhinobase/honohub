import { create } from "zustand";

type DrawerType = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
};

export const useDrawerDialog = create<DrawerType>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));
