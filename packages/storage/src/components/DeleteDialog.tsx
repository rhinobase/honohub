import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogTitle,
  Button,
  eventHandler,
  useBoolean,
} from "@rafty/ui";
import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useContentProps } from "../hooks";
import { useStorage, useStorageActions } from "../providers";
import type { StorageDataType } from "../types";

export function DeleteDialog() {
  const queryClient = useQueryClient();

  const [isLoading, setLoading] = useBoolean();

  const { queryKey, usage } = useStorage();
  const { remove: removeFile, handleError } = useStorage();
  const { remove } = useStorageActions();
  const { findContent } = useContentProps();

  const content = findContent(remove.value);

  const mutation = useMutation({
    mutationFn: (public_id: string) => removeFile(public_id),
    onMutate: async (public_id) => {
      setLoading(true);
      // Cancel current queries for the content list
      await queryClient.cancelQueries({ queryKey });

      let page_index = -1;
      let index = -1;
      let content: StorageDataType | undefined;

      // Removing optimistic content from content list
      queryClient.setQueryData<
        InfiniteData<{ results: StorageDataType[]; count: number }>
      >(queryKey, (data) => {
        if (data) {
          data.pages = data.pages.map((page, i) => {
            const results = page.results.filter((result, j) => {
              if (result.public_id === public_id) {
                page_index = i;
                index = j;
                content = result;
                return false;
              }
              return true;
            });

            const diff = page.results.length - results.length;

            if (diff) page.count -= diff;

            return { ...page, results };
          });
        }
        return data;
      });

      // Updating the orgainzation's storage usage
      if (content != null) usage.set(content.bytes);

      return { page_index, index, content };
    },
    onSuccess: () => toast.success("File has been removed"),
    onError: (error, _, context) => {
      if (!context) return;

      const { page_index, index, content } = context;

      // Adding back optimistic content to the content list
      queryClient.setQueryData<
        InfiniteData<{ results: StorageDataType[]; count: number }>
      >(queryKey, (old) => {
        if (!old) return old;

        if (content) old.pages[page_index].results.splice(index, 0, content);

        return old;
      });

      // Updating the orgainzation's storage usage
      if (content != null) usage.set(content.bytes);

      handleError?.({ error });
    },
    onSettled: () => {
      setLoading(false);
      remove.set(undefined);
    },
  });

  const handleDelete = eventHandler(async () => {
    setLoading(true);
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    await mutation.mutateAsync(content!.public_id);
  });

  return (
    <AlertDialog
      open={remove.value !== undefined}
      onOpenChange={(open) => !open && remove.set(undefined)}
    >
      <AlertDialogOverlay className="z-[60]" />
      <AlertDialogContent className="z-[60]">
        <AlertDialogTitle>Remove File?</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to remove this file? once removed, it cannot be
          recovered!
        </AlertDialogDescription>
        <div className="flex justify-end gap-3">
          <AlertDialogCancel asChild>
            <Button isDisabled={isLoading}>Cancel</Button>
          </AlertDialogCancel>
          <Button
            colorScheme="error"
            isLoading={isLoading}
            loadingText="Deleting"
            onClick={handleDelete}
            onKeyDown={handleDelete}
          >
            Delete
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
