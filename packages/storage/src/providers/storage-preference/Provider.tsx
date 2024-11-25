"use client";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useRef,
} from "react";
import { useStore } from "zustand";
import {
  type StoragePreferenceStore,
  type StoragePreferenceStoreState,
  createStoragePreferenceStore,
} from "./store";

const StoragePreferenceContext = createContext<ReturnType<
  typeof createStoragePreferenceStore
> | null>(null);

export function StoragePreferenceProvider({
  children,
  ...props
}: PropsWithChildren<Partial<StoragePreferenceStoreState>>) {
  const value = useRef(createStoragePreferenceStore(props)).current;

  return (
    <StoragePreferenceContext.Provider value={value}>
      {children}
    </StoragePreferenceContext.Provider>
  );
}

export function useStoragePreference<T>(
  selector: (state: StoragePreferenceStore) => T,
): T {
  const store = useContext(StoragePreferenceContext);

  if (!store)
    throw new Error("Missing StoragePreferenceContext.Provider in the tree!");

  return useStore(store, selector);
}
