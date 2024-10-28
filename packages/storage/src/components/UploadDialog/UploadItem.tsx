import {
  ArrowUpTrayIcon,
  CheckCircleIcon,
  DocumentIcon,
  DocumentTextIcon,
  PhotoIcon,
  PlayCircleIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button, ErrorMessage, Spinner, Text, eventHandler } from "@rafty/ui";
import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useUpload } from "../../hooks";
import { useStorage, useUploadContext } from "../../providers";
import type { StorageDataType } from "../../types";

function getFileIcon(type: string) {
  switch (type) {
    case "pdf":
      return DocumentTextIcon;
    case "image":
      return PhotoIcon;
    case "video":
      return PlayCircleIcon;
    default:
      return DocumentIcon;
  }
}

export type UploadFileItem = {
  id: string;
};

export function UploadFileItem({ id }: UploadFileItem) {
  const queryClient = useQueryClient();

  const { queryKey, usage } = useStorage();

  const { uploadedFiles, setUploadedFiles } = useUploadContext();
  const file = uploadedFiles[id].file;

  function onSuccess(data: StorageDataType) {
    const content: StorageDataType = data;

    // Adding the asset to the cache
    queryClient.setQueryData<
      InfiniteData<{ results: StorageDataType[]; count: number }>
    >(queryKey, (data) => {
      if (data)
        return {
          ...data,
          pages: [
            { results: [content], count: data.pages[0]?.count + 1 },
            ...data.pages,
          ],
        };
      return data;
    });

    // Updating the orgainzation's storage usage
    usage.set((prev) => prev + data.bytes);

    setUploadedFiles((prev) => {
      prev[id].uploaded = true;
      return { ...prev };
    });
  }

  const { error, isSuccess, percentage, retryUpload, isLoading } = useUpload({
    id,
    onSuccess,
  });

  const FileIcon = getFileIcon(file.type.split("/")[0]);

  return (
    <div className="group/upload-item min-h-[44px] flex flex-col justify-center px-3.5 py-2.5 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-all ease-in-out cursor-pointer">
      <div className="flex items-center gap-3 w-full">
        <FileIcon className="size-4 stroke-2" />
        <Text className="truncate text-sm">{file.name}</Text>
        <div className="flex-1" />
        <IndicatorRender
          error={error}
          onRemove={() =>
            setUploadedFiles((prev) => {
              delete prev[id];
              return { ...prev };
            })
          }
          retry={() => retryUpload(file)}
          isSuccess={isSuccess}
          percentage={percentage}
          isLoading={isLoading}
        />
      </div>
      {Boolean(error) && isAxiosError(error) && (
        <ErrorMessage className="text-xs font-light">
          {error.message}
        </ErrorMessage>
      )}
    </div>
  );
}

type IndicatorRender = {
  error: unknown;
  onRemove: () => void;
  retry: () => void;
  isSuccess: boolean;
  percentage: number;
  isLoading: boolean;
};

function IndicatorRender({
  error,
  onRemove,
  isSuccess,
  retry,
  percentage,
  isLoading,
}: IndicatorRender) {
  const handleRetry = eventHandler(() => retry());
  const handleRemove = eventHandler(() => onRemove());

  if (isLoading) return <Spinner size="sm" />;

  if (isSuccess)
    // File uploaded successfully
    return (
      <CheckCircleIcon className="size-5 stroke-2 text-green-500 dark:text-green-300" />
    );

  // File uploaded waiting for confirmation
  if (percentage === 100) {
    // Got an error
    if (error)
      return (
        <>
          <Button
            variant="ghost"
            size="fab"
            className="p-1"
            onClick={handleRetry}
            onKeyDown={handleRetry}
          >
            <ArrowUpTrayIcon className="size-3.5 stroke-[2.5]" />
          </Button>
          <Button
            colorScheme="error"
            variant="ghost"
            size="fab"
            className="p-1"
            onClick={handleRemove}
            onKeyDown={handleRemove}
          >
            <TrashIcon className="size-3.5 stroke-[2.5]" />
          </Button>
        </>
      );

    // Waiting for response
    return <Spinner size="sm" />;
  }

  // Cancel option while uploading the file
  return (
    <>
      <Button
        variant="ghost"
        size="fab"
        className="p-1 hidden group-hover/upload-item:flex hover:text-red-500 hover:bg-red-200/40 dark:hover:text-red-300 dark:hover:bg-red-300/10"
        onClick={handleRemove}
        onKeyDown={handleRemove}
      >
        <XMarkIcon className="size-3.5 stroke-[2.5]" />
      </Button>
      <span className="text-xs font-medium text-secondary-600 dark:text-secondary-400 group-hover/upload-item:hidden">
        {percentage}%
      </span>
    </>
  );
}
