import axios, { type CreateAxiosDefaults } from "axios";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from "react";
import { paramsSerializer } from "../utils";

export type ServerContextType = ReturnType<typeof useServerManager>;

const ServerContext = createContext<ServerContextType | null>(null);

export type ServerProvider = CreateAxiosDefaults;

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
    () => axios.create({ ...props, paramsSerializer }),
    [props],
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
