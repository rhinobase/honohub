"use client";
import {
  ArrowUpTrayIcon,
  ListBulletIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import {
  PageHeader,
  StorageLayout,
  formatBytes,
  useOrganization,
  type useStorageData,
  useStoragePreference,
  useUploadContext,
} from "@honohub/shared";
import {
  Button,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  eventHandler,
} from "@rafty/ui";
import { nanoid } from "nanoid";

type QueryProps = Pick<
  ReturnType<typeof useStorageData>,
  "data" | "isLoading" | "isError"
>;

export type StoragePageHeader = QueryProps;

export function StoragePageHeader(props: StoragePageHeader) {
  return (
    <>
      <PageHeader title="Storage">
        <div className="h-full w-px bg-secondary-200 dark:bg-secondary-800" />
        <AssetsCount {...props} />
        <div className="hidden h-full w-px bg-secondary-300 dark:bg-secondary-800 md:block" />
        <StorageMeter />
        <div className="flex-1" />
        <LayoutToggleButton {...props} />
        <UploadButton {...props} />
      </PageHeader>
    </>
  );
}

function LayoutToggleButton({ data, isLoading, isError }: QueryProps) {
  const layout = useStoragePreference((state) => state.value);
  const setLayout = useStoragePreference((state) => state.setValue);

  if (!data || isLoading)
    return <Skeleton className="size-[30px] md:size-[38px] rounded-md" />;

  if (isError) return;

  const isGridLayout = layout === StorageLayout.GRID;

  const Icon = isGridLayout ? ListBulletIcon : Squares2X2Icon;

  const handleLayoutToggle = eventHandler(() => setLayout());

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          className="p-1.5 md:p-2"
          onClick={handleLayoutToggle}
          onKeyDown={handleLayoutToggle}
        >
          <Icon className="size-4 md:size-5 stroke-2" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Switch to {isGridLayout ? "list" : "grid"} view
      </TooltipContent>
    </Tooltip>
  );
}

function UploadButton({ data, isLoading, isError }: QueryProps) {
  const { setUploadedFiles } = useUploadContext();

  const handleUpload = eventHandler(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = () => {
      setUploadedFiles((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Array.from(input.files ?? []).map((file) => [
            nanoid(),
            {
              file,
              uploaded: false,
            },
          ]),
        ),
      }));
    };
    input.click();
  });

  const icon = <ArrowUpTrayIcon className="size-4 md:size-5 stroke-2" />;

  if (!data || isLoading)
    return (
      <Skeleton className="w-[30px] h-[30px] md:w-[100px] md:h-[38px] rounded-md" />
    );

  if (isError) return;

  return (
    <>
      <Button
        colorScheme="primary"
        leftIcon={icon}
        className="hidden md:flex"
        onClick={handleUpload}
        onKeyDown={handleUpload}
      >
        Upload
      </Button>
      <Button
        colorScheme="primary"
        size="icon"
        className="md:hidden"
        onClick={handleUpload}
        onKeyDown={handleUpload}
      >
        {icon}
      </Button>
    </>
  );
}

function AssetsCount({ data, isLoading, isError }: QueryProps) {
  if (!data || isLoading)
    return <Skeleton className="w-[57.36px] h-7 rounded-md" />;

  if (isError)
    return (
      <p className="text-sm text-red-500 dark:text-red-300">
        Error fetching data
      </p>
    );

  const assetCount = data.pages[0].count;

  return (
    <p className="text-sm font-medium uppercase tracking-wide text-secondary-500 dark:text-secondary-400">
      {assetCount} {assetCount > 1 ? "Assets" : "Asset"}
    </p>
  );
}

function StorageMeter() {
  const {
    organisations,
    current: currentOrganization,
    isLoading,
    isError,
  } = useOrganization();

  if (!organisations || !currentOrganization || isLoading)
    return <Skeleton className="w-40 h-7 rounded-md hidden md:block" />;

  if (isError)
    return (
      <p className="text-sm text-red-500 dark:text-red-300 hidden md:block">
        Error fetching data
      </p>
    );

  // Getting the values
  const { used, allocated } = currentOrganization;

  return (
    <div className="hidden md:block space-y-1 w-max">
      <progress
        id="file"
        value={Math.round((used * 100) / (1073741824 * allocated))}
        max="100"
        className="block process h-1.5 w-full rounded-full"
      />
      <p className="select-none text-xs text-secondary-500 dark:text-secondary-400">
        {formatBytes(used)} of {allocated} GB used
      </p>
    </div>
  );
}
