"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export enum SidebarLayout {
  SHRINK = "S",
  DEFAULT = "D",
}

export type PreferencesStoreState = {
  sidebar?: SidebarLayout;
};

export type PreferencesStoreActions = {
  setSidebar: (layout?: SidebarLayout) => void;
};

export type PreferencesStore = PreferencesStoreState & PreferencesStoreActions;

export const createPreferencesStore = (props: Partial<PreferencesStore> = {}) =>
  create<PreferencesStore>()(
    persist(
      (set, get) => ({
        sidebar: props.sidebar,
        setSidebar: (layout) => {
          const current = get().sidebar;

          if (layout) set({ sidebar: layout });
          else
            set({
              sidebar:
                current === SidebarLayout.DEFAULT
                  ? SidebarLayout.SHRINK
                  : SidebarLayout.DEFAULT,
            });
        },
      }),
      {
        name: "preferences",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );
