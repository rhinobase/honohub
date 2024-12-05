"use client";
import { useParams } from "next/navigation";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from "react";
import { useAllCollections } from "../queries";
import type { CollectionType } from "../types";

const CollectionContext = createContext<ReturnType<
  typeof useCollectionManager
> | null>(null);

export function CollectionProvider({ children }: PropsWithChildren) {
  const value = useCollectionManager();

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
}

function useCollectionManager() {
  const params = useParams();
  const collection = params.col;

  const { data: collections, ...props } = useAllCollections();

  const collectionMap = useMemo(() => {
    if (!collections) return {};

    return collections.reduce<Record<string, CollectionType>>((prev, cur) => {
      prev[cur.slug] = cur;
      return prev;
    }, {});
  }, [collections]);

  return {
    collections,
    current: collectionMap[String(collection)],
    ...props,
  };
}

export const useCollection = () => {
  const context = useContext(CollectionContext);

  if (!context)
    throw new Error("Missing CollectionContext.Provider in the tree!");

  return context;
};
