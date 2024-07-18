import {
  type PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from "react";
import { createEndpoint } from "../utils";

export type ServerContextType = ReturnType<typeof useServerManager>;

const ServerContext = createContext<ServerContextType | null>(null);

export type ServerProvider = { baseURL: string };

export const ServerProvider = ({
  children,
  ...props
}: PropsWithChildren<ServerProvider>) => {
  const values = useServerManager(props);

  return (
    <ServerContext.Provider value={values}>{children}</ServerContext.Provider>
  );
};

function useServerManager(props: ServerProvider) {
  const endpoint = useMemo(
    () => createEndpoint(props.baseURL),
    [props.baseURL],
  );

  return {
    endpoint,
  };
}

export const useServer = () => {
  const context = useContext(ServerContext);

  if (!context) throw new Error("Missing ServerContext.Provider in the tree!");

  return context;
};
