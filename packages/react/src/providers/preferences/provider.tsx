import {
  type PropsWithChildren,
  createContext,
  useContext,
  useRef,
} from "react";
import { useStore } from "zustand";
import { type PreferencesStore, createPreferencesStore } from "./store";

const PreferencesContext = createContext<ReturnType<
  typeof createPreferencesStore
> | null>(null);

export function PreferencesProvider({ children }: PropsWithChildren) {
  const value = useRef(createPreferencesStore()).current;

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences<T>(selector: (state: PreferencesStore) => T): T {
  const store = useContext(PreferencesContext);

  if (!store)
    throw new Error("Missing PreferencesContext.Provider in the tree!");

  return useStore(store, selector);
}
