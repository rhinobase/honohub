"use client";
import { useBoolean } from "@rafty/ui";
import axios, { type Canceler } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStorage, useUploadContext } from "../providers";
import type { StorageDataType } from "../types";

export type useUpload = {
  id: string;
  onSuccess?: (data: StorageDataType) => void;
};

export function useUpload(options: useUpload) {
  const { uploadedFiles } = useUploadContext();

  const { signature: createSignature, create } = useStorage();

  const [percentage, setPercentage] = useState(0);
  const [error, setError] = useState<unknown>();
  const [isSuccess, setSuccess] = useBoolean();
  const [isLoading, setLoading] = useBoolean();
  const cancel = useRef<Canceler>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const upload = useCallback(async (file: File) => {
    // Resetting the variables
    setPercentage(0);
    setError(() => undefined);

    // Sending the request to upload the data and returning the response
    try {
      const signature = await createSignature(file);

      if (!signature) return null;

      setLoading(false);

      // Sending the request to upload the data
      return create({
        signature,
        file,
        config: {
          onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) return;
            setPercentage(
              Math.round((progressEvent.loaded * 100) / progressEvent.total),
            );
          },
          cancelToken: new axios.CancelToken((c) => {
            cancel.current = c;
          }),
        },
      }).then((data) => {
        setSuccess(true);
        options.onSuccess?.(data as StorageDataType);
      });
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error(err);
      setError(err);
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: just need to run on initial call
  useEffect(() => {
    const { file, uploaded } = uploadedFiles[options.id];

    if (uploaded) return;

    upload(file);

    return () => {
      cancel.current?.();
    };
  }, []);

  return { percentage, isSuccess, retryUpload: upload, error, isLoading };
}
