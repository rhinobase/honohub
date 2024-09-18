import { ExclamationCircleIcon, InboxIcon } from "@heroicons/react/24/outline";
import { LoadingComponent } from "@honohub/shared";
import { classNames } from "@rafty/ui";
import type { InfiniteData } from "@tanstack/react-query";
import {
  ContentDialog,
  DeleteDialog,
  InfoDrawer,
  RenameDialog,
  StorageItem,
} from "./components";
import { StorageActionsProvider } from "./providers";
import { type StorageDataType, StorageLayout } from "./types";

export type Storage = {
  data:
    | InfiniteData<
        {
          results: unknown[];
          count: number;
        },
        unknown
      >
    | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  lastElementRef: (node: HTMLDivElement) => void;
};

export function Storage({
  data,
  lastElementRef,
  isError,
  isFetching,
  isLoading,
}: Storage) {
  const {
    storage: { value: layout },
  } = usePreference();

  const files: StorageDataType[] = data
    ? Array().concat(...data.pages.map((item) => item.results))
    : [];

  const isEmpty = files.length === 0;

  const isListView = layout === StorageLayout.LIST;

  let Icon: typeof InboxIcon | undefined;
  if (isError) Icon = ExclamationCircleIcon;
  else if (isEmpty) Icon = InboxIcon;

  return (
    <>
      <div
        className={classNames(
          isListView
            ? "mx-auto max-w-4xl space-y-2 md:space-y-3"
            : "grid grid-cols-1 gap-3 md:gap-4 lg:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
          "w-full",
        )}
      >
        <StorageActionsProvider>
          {files.map((file, index) => (
            <StorageItem
              key={file._id}
              ref={files.length === index + 1 ? lastElementRef : undefined}
              {...file}
            />
          ))}
          <ContentDialog />
          <InfoDrawer />
          <RenameDialog />
          <DeleteDialog />
        </StorageActionsProvider>
      </div>
      {(isEmpty || isError) && (
        <div
          className={classNames(
            "flex h-full w-full items-center justify-center gap-1.5 select-none",
            isError
              ? "text-red-500 dark:text-red-300"
              : "text-secondary-600 dark:text-secondary-400",
          )}
        >
          {Icon && <Icon className="size-5 stroke-2" />}
          <p className="text-sm">No data found</p>
        </div>
      )}
      {isLoading && <LoadingComponent>Loading content...</LoadingComponent>}
      {isFetching && !isLoading && (
        <LoadingComponent className="h-max py-10">
          Loading more data...
        </LoadingComponent>
      )}
    </>
  );
}
