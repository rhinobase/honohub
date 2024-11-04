"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export enum StorageLayout {
  GRID = "G",
  LIST = "L",
}

export type StoragePreferenceStoreState = {
  value?: StorageLayout;
};

export type StoragePreferenceStoreActions = {
  setValue: (layout?: StorageLayout) => void;
};

export type StoragePreferenceStore = StoragePreferenceStoreState &
  StoragePreferenceStoreActions;

export const createStoragePreferenceStore = (
  props: Partial<StoragePreferenceStore> = {},
) =>
  create<StoragePreferenceStore>()(
    persist(
      (set, get) => ({
        value: props.value ?? StorageLayout.GRID,
        setValue: (layout) => {
          const current = get().value;

          if (layout) set({ value: layout });
          else
            set({
              value:
                current === StorageLayout.GRID
                  ? StorageLayout.LIST
                  : StorageLayout.GRID,
            });
        },
      }),
      {
        name: "storage_preference",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );
