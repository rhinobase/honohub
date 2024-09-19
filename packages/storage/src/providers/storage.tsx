"use client";
import type { AxiosRequestConfig } from "axios";
import { type PropsWithChildren, createContext, useContext } from "react";
import type { UseFormSetError } from "react-hook-form";
import type { StorageDataType } from "../types";

type StorageFunctions = {
  list: <T>(options: {
    org: string;
    limit?: number;
    offset?: number;
    search?: string;
  }) => Promise<{
    results: T[];
    count: number;
  }>;
  signature: (options: {
    org: string;
    file: File;
  }) => Promise<Record<string, string>>;
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
};

const StorageContext = createContext<StorageFunctions | null>(null);

export function StorageProvider({
  children,
  ...props
}: PropsWithChildren<StorageFunctions>) {
  return (
    <StorageContext.Provider value={props}>{children}</StorageContext.Provider>
  );
}

export const useStorage = () => {
  const context = useContext(StorageContext);

  if (!context) throw new Error("Missing StorageContext.Provider in the tree!");

  return context;
};
