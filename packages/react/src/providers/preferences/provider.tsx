import { useBreakpointValue } from "@rafty/ui";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
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
      <AutoSidebarLayouter />
      {children}
    </PreferencesContext.Provider>
  );
}

function AutoSidebarLayouter() {
  const { setShrink } = usePreferences((state) => ({
    setShrink: state.setShrink,
  }));

  const breakPointValue =
    useBreakpointValue({
      sm: false,
      md: true,
      lg: true,
      xl: false,
    }) ?? false;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setShrink(breakPointValue);
  }, [breakPointValue]);

  return <></>;
}

export function usePreferences<T>(selector: (state: PreferencesStore) => T): T {
  const store = useContext(PreferencesContext);

  if (!store)
    throw new Error("Missing PreferencesContext.Provider in the tree!");

  return useStore(store, selector);
}
