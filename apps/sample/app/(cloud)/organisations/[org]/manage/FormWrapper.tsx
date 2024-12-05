"use client";
import {
  DocumentSubmitType,
  FormFooter,
  FormMode,
  LoadingSkeletons,
  SUBMIT_BUTTON_KEY,
  type StaticCollection,
  endpoint,
  getManageDocumentQueryKey,
  getManageQueryKey,
  handleError,
  useQueryParams,
} from "@honohub/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect } from "react";
import { type FieldValues, useFormContext } from "react-hook-form";
import toast from "react-hot-toast";

const QUERY_PARAMS = {
  limit: 10,
  offset: 0,
};

export type ManageFormWrapper<T extends FieldValues> = PropsWithChildren<{
  data: T | undefined;
  slug: StaticCollection.USERS | StaticCollection.ROLES;
  isLoading?: boolean;
}>;

export function ManageFormWrapper<T extends FieldValues>({
  data,
  slug,
  children,
  isLoading,
}: ManageFormWrapper<T>) {
  const { handleSubmit, reset, setError } = useFormContext();
  const { org, id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const mode = id ? FormMode.UPDATE : FormMode.CREATE;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (data) reset(data);
  }, [data]);

  const manageUserDelete = useManageDelete({ org, slug, id });

  const handleDelete = async () => {
    await manageUserDelete();
  };

  const manageItemQueryKey = getManageDocumentQueryKey({ org, slug, id });

  const manageQueryKey = getManageQueryKey({
    org,
    slug,
    params: QUERY_PARAMS,
  });

  const mutation = useMutation({
    mutationFn: async (values: FieldValues) => {
      const data = {
        ...values,
        [SUBMIT_BUTTON_KEY]: undefined,
        _id: undefined,
        _nid: undefined,
        created_on: undefined,
        created_by: undefined,
        updated_on: undefined,
        updated_by: undefined,
      };

      if (mode === FormMode.UPDATE)
        return await endpoint.put(
          `/organisations/${org}/manage/${slug}/${id}`,
          data,
        );

      return await endpoint.post(`/organisations/${org}/manage/${slug}`, data);
    },
    onSuccess: (_, values) => {
      const document_submit_type_value = values[SUBMIT_BUTTON_KEY];

      if (document_submit_type_value === DocumentSubmitType.SAVE) {
        queryClient.invalidateQueries({
          queryKey: manageQueryKey,
        });

        router.push(`/organisations/${org}/manage/${slug}`);
      } else reset();

      queryClient.invalidateQueries({
        queryKey: manageItemQueryKey,
      });

      toast.success("Operation successfully completed");
    },
    onError: (err) => handleError(err, setError),
  });

  return (
    <form
      onSubmit={handleSubmit(
        (values) => mutation.mutateAsync(values),
        console.error,
      )}
      className="w-full flex flex-col gap-3 md:gap-4 lg:gap-5 xl:gap-6"
    >
      <div className="w-full flex flex-col gap-3 md:gap-4 lg:gap-5 xl:gap-6 max-w-4xl mx-auto">
        {isLoading ? <LoadingSkeletons count={6} /> : children}
      </div>
      <div className="sticky bottom-0 z-40 left-0 w-full rounded-md bg-white dark:bg-secondary-950 shadow-[0_-8px_20px_-3px_rgba(2,2,2,0.1)] dark:shadow-none [&>div]:ring-1 [&>div]:ring-black/10 dark:[&>div]:ring-white/15 [&>div]:bg-secondary-50">
        <FormFooter mode={mode} onDelete={handleDelete} />
      </div>
    </form>
  );
}

function useManageDelete(options: {
  org: string | string[];
  slug: StaticCollection.USERS | StaticCollection.ROLES;
  id: string | string[];
}) {
  const { org, slug, id } = options;
  const router = useRouter();
  const queryClient = useQueryClient();

  const params = useQueryParams();
  const queryKey = getManageQueryKey({
    org,
    slug,
    params,
  });

  const mutation = useMutation({
    mutationFn: () =>
      endpoint.delete(`/organisations/${org}/manage/${slug}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });

      router.push(`/organisations/${org}/manage/${slug}`);

      toast.success("Data Deleted Successfully!");
    },
    onError: (err) => handleError(err),
  });

  return mutation.mutateAsync;
}
