"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, DialogClose, FieldWrapper, InputField } from "@rafty/ui";
import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { useContentProps } from "../../hooks";
import { useStorage, useStorageActions } from "../../providers";
import type { StorageDataType } from "../../types";

const schema = z.object({
  name: z.string().max(30),
});

export function RenameForm() {
  const queryClient = useQueryClient();

  const { queryKey } = useStorage();
  const { findContent } = useContentProps();
  const { rename } = useStorageActions();

  const content = findContent(rename.value);

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const { update, handleError } = useStorage();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setError,
  } = methods;

  const mutation = useMutation({
    mutationFn: ({
      old_public_id,
      name,
    }: {
      old_public_id: string;
      name: string;
    }) => update(old_public_id, name),
    onMutate: async ({ old_public_id, name }) => {
      // Cancel current queries for the content list
      await queryClient.cancelQueries({ queryKey });

      const [folder, _] = old_public_id.split("/");
      const current = [folder, name].join("/");

      // Updating optimistic content to content list
      queryClient.setQueryData<
        InfiniteData<{ results: StorageDataType[]; count: number }>
      >(queryKey, (data) => {
        if (data) {
          let pageIndex = 0;
          let contentIndex = 0;
          let found = false;

          for (; pageIndex < data.pages.length; pageIndex++) {
            const page = data.pages[pageIndex];
            for (; contentIndex < page.results.length; contentIndex++) {
              const content = page.results[contentIndex];
              if (content.public_id === old_public_id) {
                found = true;
                break;
              }
            }
            if (found) break;
          }

          if (found)
            data.pages[pageIndex].results[contentIndex].public_id = current;
        }
        return data;
      });
    },
    onSuccess: () => {
      toast.success("Renamed the file");
    },
    onError: (error, { old_public_id, name }) => {
      const [folder, _] = old_public_id.split("/");
      const current = [folder, name].join("/");

      // Removing optimistic update from the content list
      queryClient.setQueryData<
        InfiniteData<{ results: StorageDataType[]; count: number }>
      >(queryKey, (data) => {
        if (data) {
          let pageIndex = 0;
          let contentIndex = 0;
          let found = false;

          for (; pageIndex < data.pages.length; pageIndex++) {
            const page = data.pages[pageIndex];
            for (; contentIndex < page.results.length; contentIndex++) {
              const content = page.results[contentIndex];
              if (content.public_id === current) {
                found = true;
                break;
              }
            }
            if (found) break;
          }

          if (found)
            data.pages[pageIndex].results[contentIndex].public_id =
              old_public_id;
        }
        return data;
      });
      handleError?.({ error, setError });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey, exact: true });
      rename.set(undefined);
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (content) reset({ name: content.public_id?.split("/").pop() });
  }, [content]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(
          ({ name }) =>
            mutation.mutateAsync({
              name,
              old_public_id: content?.public_id ?? "",
            }),
          console.error,
        )}
      >
        <FieldWrapper name="name" label="Enter new name" isRequired>
          <InputField {...register("name")} />
        </FieldWrapper>
        <div className="mt-3 flex items-center justify-end gap-4">
          <DialogClose asChild>
            <Button disabled={isSubmitting}>Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            colorScheme="primary"
            loadingText="Saving"
            isLoading={isSubmitting}
          >
            Save
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
