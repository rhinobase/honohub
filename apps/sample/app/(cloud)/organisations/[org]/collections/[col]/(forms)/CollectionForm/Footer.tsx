"use client";
import {
  FormFooter,
  type FormMode,
  endpoint,
  getCollectionQueryKey,
  handleError,
  useQueryParams,
} from "@honohub/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";

export type Footer = {
  formMode: FormMode;
};

export function Footer(props: Footer) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { org, col, id } = useParams();

  const { setError } = useFormContext();
  const queryParams = useQueryParams();

  const mutation = useMutation({
    mutationFn: () =>
      endpoint.delete(`/organisations/${org}/collections/${col}/${id}`),
    onSuccess: () => {
      const queryKey = getCollectionQueryKey({
        org,
        col,
        ...queryParams,
      });

      queryClient.invalidateQueries({
        queryKey,
      });

      router.push(`/organisations/${org}/collections/${col}`);

      toast.success("Data Deleted Successfully!");
    },
    onError: (err) => handleError(err, setError),
  });

  return (
    <div className="sticky bottom-0 z-40 left-0 w-full rounded-md bg-white dark:bg-secondary-950 shadow-[0_-8px_20px_-3px_rgba(2,2,2,0.1)] dark:shadow-none [&>div]:ring-1 [&>div]:ring-black/10 dark:[&>div]:ring-white/15 [&>div]:bg-secondary-50 [&>div]:mb-0 md:[&>div]:mb-0 lg:[&>div]:mb-0 xl:[&>div]:mb-0">
      <FormFooter
        mode={props.formMode}
        onDelete={async () => {
          await mutation.mutateAsync();
        }}
      />
    </div>
  );
}
