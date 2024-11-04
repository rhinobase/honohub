"use client";
import type { AxiosRequestConfig } from "axios";
import {
  type PropsWithChildren,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { UseFormSetError } from "react-hook-form";
import type { StorageDataType } from "../types";

type StorageFunctions = {
  queryKey: string[];
  signature: (file: File) => Promise<Record<string, string>>;
  create: <T>(options: {
    signature: Record<string, string>;
    file: File;
    config: Pick<AxiosRequestConfig, "onUploadProgress" | "cancelToken">;
  }) => Promise<T>;
  update: <T>(publicId: string, name: string) => Promise<T>;
  remove: <T>(publicId: string) => Promise<T>;
  generateURL: (props: {
    content: StorageDataType;
    filters?: Record<string, unknown>;
    raw?: boolean;
  }) => string;
  handleError?: <T extends Record<string, unknown>>(props: {
    error: unknown;
    setError?: UseFormSetError<T>;
  }) => void;
  usage: number;
  onUsageChange?: (usage: number) => void;
  imageRender?: (props: {
    src: string;
    alt: string;
    className?: string;
    height?: number;
    width?: number;
  }) => ReactNode;
};

const StorageContext = createContext<ReturnType<
  typeof useStorageManager
> | null>(null);

export function StorageProvider({
  children,
  ...props
}: PropsWithChildren<StorageFunctions>) {
  const value = useStorageManager(props);

  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
}

function useStorageManager({
  usage: _usage,
  onUsageChange,
  queryKey,
  imageRender = (props) => <img {...props} alt={props.alt} />,
  ...funcs
}: StorageFunctions) {
  const [usage, setUsage] = useState<number>(_usage);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    onUsageChange?.(usage);
  }, [usage]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const storageFuncs = useMemo(() => funcs, []);

  return {
    usage: { value: usage, set: setUsage },
    queryKey,
    imageRender,
    ...storageFuncs,
  };
}

export const useStorage = () => {
  const context = useContext(StorageContext);

  if (!context) throw new Error("Missing StorageContext.Provider in the tree!");

  return context;
};
