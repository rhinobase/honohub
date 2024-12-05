"use client";
import { useBreakpointValue } from "@rafty/ui";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useStore } from "zustand";
import {
  type PreferencesStore,
  type PreferencesStoreState,
  SidebarLayout,
  createPreferencesStore,
} from "./store";

const PreferencesContext = createContext<ReturnType<
  typeof createPreferencesStore
> | null>(null);

export function PreferencesProvider({
  children,
  ...props
}: PropsWithChildren<Partial<PreferencesStoreState>>) {
  const value = useRef(createPreferencesStore(props)).current;

  return (
    <PreferencesContext.Provider value={value}>
      <AutoSidebarLayouter />
      {children}
    </PreferencesContext.Provider>
  );
}

function AutoSidebarLayouter() {
  const layout = usePreferences((state) => state.sidebar);
  const setLayout = usePreferences((state) => state.setSidebar);

  const shrink = useBreakpointValue({
    sm: false,
    md: true,
    lg: false,
    xl: false,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!layout && shrink)
      setLayout(shrink ? SidebarLayout.SHRINK : SidebarLayout.DEFAULT);
  }, [shrink, layout]);

  return <></>;
}

export function usePreferences<T>(selector: (state: PreferencesStore) => T): T {
  const store = useContext(PreferencesContext);

  if (!store)
    throw new Error("Missing PreferencesContext.Provider in the tree!");

  return useStore(store, selector);
}
