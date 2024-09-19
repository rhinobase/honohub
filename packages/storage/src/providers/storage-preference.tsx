"use client";
import { useLocalStorage } from "@honohub/shared";
import { type PropsWithChildren, createContext, useContext } from "react";

const STORAGE_PREFERENCE_KEY = "__storage";

export enum StorageLayout {
  GRID = "G",
  LIST = "L",
}

const StoragePreferenceContext = createContext<ReturnType<
  typeof useStoragePreferenceManager
> | null>(null);

export function StoragePreferenceProvider({ children }: PropsWithChildren) {
  const value = useStoragePreferenceManager();

  return (
    <StoragePreferenceContext.Provider value={value}>
      {children}
    </StoragePreferenceContext.Provider>
  );
}

function useStoragePreferenceManager() {
  const [storageLayout, setStorageLayout] = useLocalStorage<StorageLayout>({
    storageKey: STORAGE_PREFERENCE_KEY,
    defaultValue: StorageLayout.GRID,
  });

  const handleStorageLayout = (layout?: StorageLayout) =>
    setStorageLayout((prev) => {
      if (layout) return layout;
      if (prev === StorageLayout.GRID) return StorageLayout.LIST;
      return StorageLayout.GRID;
    });

  return {
    value: storageLayout,
    toggle: handleStorageLayout,
  };
}

export function useStoragePreference() {
  const context = useContext(StoragePreferenceContext);

  if (!context)
    throw new Error("Missing StoragePreferenceContext.Provider in the tree!");

  return context;
}
