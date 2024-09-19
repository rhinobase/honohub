"use client";
import { useBoolean } from "@rafty/ui";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

const UploadContext = createContext<ReturnType<typeof useUploadManager> | null>(
  null,
);

export function UploadProvider({ children }: PropsWithChildren) {
  const value = useUploadManager();

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
}

function useUploadManager() {
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, { file: File; uploaded: boolean }>
  >({});
  const [isCancel, toggleCancel] = useBoolean();
  const [isMinimized, toggleMinimize] = useBoolean();

  return {
    uploadedFiles,
    setUploadedFiles,
    isCancel,
    toggleCancel,
    isMinimized,
    toggleMinimize,
  };
}

export function useUploadContext() {
  const context = useContext(UploadContext);

  if (!context) throw new Error("Missing UploadContext.Provider in the tree!");

  return context;
}
