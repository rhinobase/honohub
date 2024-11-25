import { ExclamationCircleIcon, InboxIcon } from "@heroicons/react/24/outline";
import { Spinner, classNames } from "@rafty/ui";
import {
  type InfiniteData,
  useIsFetching,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ContentDialog,
  DeleteDialog,
  InfoDrawer,
  RenameDialog,
  StorageItem,
} from "./components";
import {
  StorageActionsProvider,
  StorageLayout,
  useStorage,
  useStoragePreference,
} from "./providers";
import type { StorageDataType } from "./types";

export type Storage = {
  lastElementRef: (node: HTMLDivElement) => void;
};

export function Storage(props: Storage) {
  const { queryKey } = useStorage();
  const layout = useStoragePreference((state) => state.value);

  const queryClient = useQueryClient();

  const data =
    queryClient.getQueryData<
      InfiniteData<{ results: StorageDataType[]; count: number }>
    >(queryKey);

  const dataState = queryClient.getQueryState(queryKey);

  const isLoading = dataState?.status === "pending";
  const isError = dataState?.status === "error";
  const isFetching = useIsFetching({ queryKey, exact: true });

  const files: StorageDataType[] = data
    ? Array().concat(...data.pages.map((item) => item.results))
    : [];

  const isEmpty = data?.pages[0]?.results.length === 0;

  const isListView = layout === StorageLayout.LIST;

  let Icon: typeof InboxIcon | undefined;
  if (isError) Icon = ExclamationCircleIcon;
  else if (isEmpty) Icon = InboxIcon;

  return (
    <>
      <div
        className={classNames(
          isListView
            ? "mx-auto max-w-4xl flex flex-col gap-2 md:gap-3"
            : "grid grid-cols-1 gap-3 md:gap-4 lg:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
          "w-full",
        )}
      >
        <StorageActionsProvider>
          {files.map((file, index) => (
            <StorageItem
              key={file._id}
              ref={
                files.length === index + 1 ? props.lastElementRef : undefined
              }
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
      {isLoading && (
        <div className="size-full flex items-center justify-center gap-1.5">
          <Spinner />
          <p className="text-secondary-600 dark:text-secondary-400 text-sm">
            Loading content...
          </p>
        </div>
      )}
      {isFetching && !isLoading && (
        <div className="w-full flex items-center justify-center gap-1.5 py-10">
          <Spinner />
          <p className="text-secondary-600 dark:text-secondary-400 text-sm">
            Loading more data...
          </p>
        </div>
      )}
    </>
  );
}
