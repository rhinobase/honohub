import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

type DialogManagerContextType = ReturnType<typeof useDialogManagerWatcher>;

const DialogManagerContext = createContext<DialogManagerContextType | null>(
  null,
);

export const DialogManagerProvider = (props: PropsWithChildren) => {
  const values = useDialogManagerWatcher();

  return (
    <DialogManagerContext.Provider value={values}>
      {props.children}
    </DialogManagerContext.Provider>
  );
};

export type ActionType =
  | { show: true; title: string; message: string; action: () => void }
  | { show: false };

function useDialogManagerWatcher() {
  const [action, setAction] = useState<ActionType>({ show: false });

  return { action: { state: action, setState: setAction } };
}

export const useDialogManager = () => {
  const context = useContext(DialogManagerContext);

  if (!context)
    throw new Error("Missing DialogManagerContext.Provider in the tree!");

  return context;
};
