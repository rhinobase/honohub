import { useBoolean } from "@rafty/ui";
import { type PropsWithChildren, createContext, useContext } from "react";

const DrawerContext = createContext<ReturnType<typeof useDrawerManager> | null>(
  null,
);

export function DrawerProvider({ children }: PropsWithChildren) {
  const value = useDrawerManager();

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  );
}

function useDrawerManager() {
  const [isOpen, setOpen] = useBoolean();

  return { isOpen, setOpen };
}

export function useDrawer() {
  const context = useContext(DrawerContext);

  if (!context) throw new Error("Missing DrawerContext.Provider in the tree!");

  return context;
}
