import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export enum SupportedLang {
  NODEJS = "js",
  PYTHON = "py",
  CURL = "bash",
}

export type PreferencesStoreProps = {
  lang: SupportedLang;
  isShrink: boolean;
};

export type PreferencesStore = PreferencesStoreProps & {
  setLang: (value: SupportedLang) => void;
  setShrink: (value?: boolean) => void;
};

export const createPreferencesStore = () =>
  create<PreferencesStore>()(
    persist(
      (set) => ({
        isShrink: false,
        lang: SupportedLang.NODEJS,
        setLang: (value: SupportedLang) => set({ lang: value }),
        setShrink: (value) =>
          set((state) => ({
            isShrink: value !== undefined ? value : !state.isShrink,
          })),
      }),
      {
        name: "preferences",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  );
