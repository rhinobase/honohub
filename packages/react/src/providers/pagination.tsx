import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

const PaginationContext = createContext<ReturnType<
  typeof usePaginationManager
> | null>(null);

export function PaginationProvider({ children }: PropsWithChildren) {
  const value = usePaginationManager();

  return (
    <PaginationContext.Provider value={value}>
      {children}
    </PaginationContext.Provider>
  );
}

function usePaginationManager() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  return { pagination, setPagination };
}

export function usePagination() {
  const context = useContext(PaginationContext);

  if (!context)
    throw new Error("Missing PaginationContext.Provider in the tree!");

  return context;
}
