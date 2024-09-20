import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export enum SupportedLang {
  NODEJS = "js",
  PYTHON = "py",
  CURL = "bash",
}

export type PreferencesStoreProps = {
  lang: SupportedLang;
};

export type PreferencesStore = PreferencesStoreProps & {
  setLang: (value: SupportedLang) => void;
};

export const createPreferencesStore = () =>
  create<PreferencesStore>()(
    persist(
      (set) => ({
        lang: SupportedLang.NODEJS,
        setLang: (value: SupportedLang) => set({ lang: value }),
      }),
      {
        name: "preferences",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  );
