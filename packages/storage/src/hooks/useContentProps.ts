import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useStorage } from "../providers";
import type { StorageDataType } from "../types";

export function useContentProps() {
  const { queryKey } = useStorage();
  const queryClient = useQueryClient();

  const data = queryClient
    .getQueryData<InfiniteData<{ results: StorageDataType[]; count: number }>>(
      queryKey,
    )
    ?.pages.flatMap((item) => item.results);

  function findContent(id?: string) {
    return data?.find((item) => item.public_id === id);
  }

  function getNext(id?: string) {
    if (!data) return;

    const index = data.findIndex((item) => item.public_id === id);
    if (data.length - 1 === index) return;

    return data[index + 1].public_id;
  }

  function getPrevious(id?: string) {
    if (!data) return;

    const index = data.findIndex((item) => item.public_id === id);
    if (index === 0) return;

    return data[index - 1].public_id;
  }

  return { findContent, getNext, getPrevious };
}
