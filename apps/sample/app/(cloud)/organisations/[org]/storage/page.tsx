"use client";
import { Storage, useStorageData } from "@honohub/shared";
import { useLastElement } from "@rafty/ui";
import { StoragePageHeader } from "./Header";
import StorageWrapper from "./Wrapper";

export default function StoragePage() {
  const props = useStorageData();

  const lastElementRef = useLastElement({
    fetchNextPage: props.fetchNextPage,
    hasNextPage: props.hasNextPage,
    isFetching: props.isFetching,
  });

  return (
    <StorageWrapper>
      <StoragePageHeader {...props} />
      <Storage {...props} lastElementRef={lastElementRef} />
    </StorageWrapper>
  );
}
