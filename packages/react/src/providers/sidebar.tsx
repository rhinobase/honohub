import { useBreakpointValue } from "@rafty/ui";
import { useBoolean } from "@rafty/ui";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
} from "react";

const SidebarContext = createContext<ReturnType<
  typeof useSidebarManager
> | null>(null);

export function SidebarProvider({ children }: PropsWithChildren) {
  const value = useSidebarManager();

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

function useSidebarManager() {
  const [isShrink, setShrink] = useBoolean();

  const value =
    useBreakpointValue({
      sm: false,
      md: true,
      lg: true,
      xl: false,
    }) ?? false;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setShrink(value);
  }, [value]);

  return { isShrink, setShrink };
}

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) throw new Error("Missing SidebarContext.Provider in the tree!");

  return context;
}
