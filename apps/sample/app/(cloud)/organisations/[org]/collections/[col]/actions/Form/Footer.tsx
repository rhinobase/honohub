"use client";
import {
  type FormMode,
  FormFooter as SharedFormFooter,
  endpoint,
  getCollectionActionsQueryKey,
  handleError,
  useQueryParams,
} from "@honohub/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";

export type FormFooter = {
  mode: FormMode;
};

export function FormFooter(props: FormFooter) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { org, col, id } = useParams();

  const queryParams = useQueryParams();

  const { setError } = useFormContext();

  const mutation = useMutation({
    mutationFn: () =>
      endpoint.delete(`/organisations/${org}/collections/${col}/actions/${id}`),
    onSuccess: () => {
      const queryKey = getCollectionActionsQueryKey({
        org,
        col,
        ...queryParams,
      });

      queryClient.invalidateQueries({
        queryKey,
      });

      router.push(`/organisations/${org}/collections/${col}/actions`);

      toast.success("Data Deleted Successfully!");
    },
    onError: (err) => handleError(err, setError),
  });

  return (
    <SharedFormFooter
      mode={props.mode}
      onDelete={async () => {
        await mutation.mutateAsync();
      }}
    />
  );
}
