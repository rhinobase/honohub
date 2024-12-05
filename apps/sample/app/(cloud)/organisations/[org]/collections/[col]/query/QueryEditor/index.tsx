"use client";
import {
  ErrorComponent,
  LoadingComponent,
  endpoint,
  type jsonValidator as schema,
} from "@honohub/shared";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import type z from "zod";
import { QueryEditorForm } from "./Form";
import { QueryOutput } from "./QueryOutput";

export function QueryEditor() {
  const { org, col } = useParams();

  const mutation = useMutation({
    mutationFn: (value: z.infer<typeof schema>) =>
      endpoint
        .post(
          `/organisations/${org}/collections/${col}/dev/aggregator`,
          value.editor,
        )
        .then((res) => res.data),
    onError: (error) => {
      toast.error(error.name);
      console.error(error);
    },
  });

  return (
    <div className="grid h-full grid-cols-1 md:grid-cols-2 border border-secondary-200 dark:border-secondary-800 rounded-md overflow-hidden">
      <QueryEditorForm onSubmit={(values) => mutation.mutateAsync(values)} />
      <div className="py-3 px-4 h-full overflow-y-auto border-t md:border-t-0 md:border-l border-secondary-200 dark:border-secondary-800">
        {mutation.isPending ? (
          <LoadingComponent />
        ) : mutation.isError ? (
          <ErrorComponent>{mutation.error.message}</ErrorComponent>
        ) : (
          <QueryOutput queryData={mutation.data} />
        )}
      </div>
    </div>
  );
}
