"use client";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import type { StorageDataType } from "../../storage";

const ImageHeaderContext = createContext<ReturnType<
  typeof useImageHeaderManager
> | null>(null);

export function ImageHeaderProvider({ children }: PropsWithChildren) {
  const value = useImageHeaderManager();

  return (
    <ImageHeaderContext.Provider value={value}>
      {children}
    </ImageHeaderContext.Provider>
  );
}

function useImageHeaderManager() {
  const [content, setContent] = useState<StorageDataType>();

  return { content, setContent };
}

export function useImageHeader() {
  const context = useContext(ImageHeaderContext);

  if (!context)
    throw new Error("Missing ImageHeaderContext.Provider in the tree!");

  return context;
}
