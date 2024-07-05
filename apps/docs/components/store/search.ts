import { create } from "zustand";

type SearchDialogType = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
};

export const useSearchDialog = create<SearchDialogType>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));
