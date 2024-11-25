"use client";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

const StorageActionsContext = createContext<ReturnType<
  typeof useStorageActionsManager
> | null>(null);

export function StorageActionsProvider({ children }: PropsWithChildren) {
  const value = useStorageActionsManager();
  return (
    <StorageActionsContext.Provider value={value}>
      {children}
    </StorageActionsContext.Provider>
  );
}

function useStorageActionsManager() {
  const [view, setView] = useState<string>();
  const [info, setInfo] = useState<string>();
  const [rename, setRename] = useState<string>();
  const [remove, setRemove] = useState<string>();

  return {
    view: { value: view, set: setView },
    info: { value: info, set: setInfo },
    rename: { value: rename, set: setRename },
    remove: { value: remove, set: setRemove },
  };
}

export const useStorageActions = () => {
  const context = useContext(StorageActionsContext);

  if (!context)
    throw new Error("Missing StorageActionsContext.Provider in the tree!");

  return context;
};
