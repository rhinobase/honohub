import {
  CloudIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  eventHandler,
  useBoolean,
} from "@rafty/ui";
import { useField } from "duck-form";
import { useCallback, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { LoadingComponent } from "../../../../../shared";
import type { StorageDataType } from "../../../../../storage";
import { useStorageData } from "../../../../queries";
import { UploadFromCard } from "../UploadFromCard";
import type { FileInputFieldProps } from "../types";
import { UploadFromStorageItem } from "./Item";

export type UploadFromStorage = {
  id: string;
  handleDialogClose: () => void;
};

export function UploadFromStorage({
  id,
  handleDialogClose,
}: UploadFromStorage) {
  const [isOpen, setOpen] = useBoolean();
  const [selectedFiles, setSelectedFiles] = useState<StorageDataType[]>([]);

  const { options } = useField<FileInputFieldProps>();
  const { control, setValue } = useFormContext();

  const fieldValue = useWatch({ control, name: id });

  const { data, isFetching, fetchNextPage, hasNextPage, isLoading, isError } =
    useStorageData();

  const files: StorageDataType[] = data
    ? Array().concat(...data.pages.map((item) => item.results))
    : [];

  const isEmpty = files.length === 0;

  const observer = useRef<any>();
  const lastImageElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      });
      if (node) observer.current.observe(node);
    },
    [isFetching, hasNextPage, fetchNextPage],
  );

  const handleDialogOpen = eventHandler(() => setOpen(true));

  const handleOnSelectComplete = eventHandler(() => {
    if (!options?.multiple)
      setValue(id, {
        type: selectedFiles[0].type,
        public_id: selectedFiles[0].public_id,
        _ref: selectedFiles[0]._id,
        resource_type: selectedFiles[0].resource_type,
        format: selectedFiles[0].format,
        _type: "contents",
      });
    else
      setValue(id, [
        ...(fieldValue ?? []),
        ...selectedFiles.map((item) => ({
          _ref: item._id,
          _type: "contents",
          type: item.type,
          version: item.version,
          public_id: item.public_id,
          resource_type: item.resource_type,
          format: item.format,
        })),
      ]);
    handleDialogClose();
  });

  return (
    <>
      <UploadFromCard
        title="Spaces"
        description="Choose file form spaces."
        icon={CloudIcon}
        onClick={handleDialogOpen}
        onKeyDown={handleDialogOpen}
      />
      <Dialog size="xl" open={isOpen} onOpenChange={setOpen}>
        <DialogOverlay />
        <DialogContent
          className="p-4 pr-0 gap-4 h-[calc(100vh-50px)] flex-col md:w-[95%]"
          showCloseButton={false}
        >
          <DialogHeader className="pr-4">
            <DialogTitle>
              Select {options?.multiple ? "Files" : "File"}
            </DialogTitle>
            <div className="flex-1" />
            <Button
              colorScheme="primary"
              onClick={handleOnSelectComplete}
              onKeyDown={handleOnSelectComplete}
              isDisabled={selectedFiles?.length === 0}
            >
              Done
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <XMarkIcon className="size-6 stroke-2" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full overflow-y-auto pr-4">
            {files.map((file, index) => {
              const isSelected = Boolean(
                selectedFiles &&
                  selectedFiles.findIndex((item) => item._id === file._id) !==
                    -1,
              );

              const handleSelect = eventHandler(() => {
                if (!isSelected && !options?.multiple)
                  setSelectedFiles(() => [file]);
                else if (!isSelected)
                  setSelectedFiles((prev) => [...(prev ?? []), file]);
                else
                  setSelectedFiles((prev) => {
                    const tmp = [...(prev ?? [])];
                    tmp?.splice(
                      tmp.findIndex((item) => item._id === file._id),
                      1,
                    );
                    return tmp;
                  });
              });

              return (
                <UploadFromStorageItem
                  key={file._id}
                  ref={
                    files.length === index + 1 ? lastImageElementRef : undefined
                  }
                  {...file}
                  isSelected={isSelected}
                  onClick={handleSelect}
                  onKeyDown={handleSelect}
                />
              );
            })}
          </div>
          {(isEmpty || isError) && (
            <div className="flex h-full w-full items-center justify-center gap-1.5 text-red-500 dark:text-red-300">
              <ExclamationCircleIcon className="size-5 stroke-2" />
              <p className="text-sm">No data found</p>
            </div>
          )}
          {isLoading && (
            <LoadingComponent>Getting storage data...</LoadingComponent>
          )}
          {isFetching && !isLoading && (
            <LoadingComponent className="h-max py-4">
              Loading more data...
            </LoadingComponent>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
