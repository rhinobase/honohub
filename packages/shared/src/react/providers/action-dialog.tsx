"use client";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

type ActionDialogContextType = ReturnType<typeof useActionDialogManager>;

const ActionDialogContext = createContext<ActionDialogContextType | null>(null);

export const ActionDialogProvider = (props: PropsWithChildren) => {
  const values = useActionDialogManager();

  return (
    <ActionDialogContext.Provider value={values}>
      {props.children}
    </ActionDialogContext.Provider>
  );
};

function useActionDialogManager() {
  const [action, setAction] = useState<
    | { show: true; title: string; message: string; event: () => void }
    | { show: false }
  >({ show: false });

  return { action, setAction };
}

export const useActionDialog = () => {
  const context = useContext(ActionDialogContext);

  if (!context)
    throw new Error("Missing ActionDialogContext.Provider in the tree!");

  return context;
};
