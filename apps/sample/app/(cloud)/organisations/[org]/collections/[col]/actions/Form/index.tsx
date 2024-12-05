"use client";
import {
  DocumentSubmitType,
  FormMode,
  LoadingSkeletons,
  SUBMIT_BUTTON_KEY,
  collectionActionValidation,
  endpoint,
  getCollectionActionDocumentQueryKey,
  getCollectionActionsQueryKey,
  handleError,
  submitButtonValidation,
} from "@honohub/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldWrapper, InputField } from "@rafty/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type z from "zod";
import { FormFooter } from "./Footer";
import { LevelField } from "./LevelField";

export type CollectionActionForm =
  | {
      mode: FormMode.UPDATE;
      data?: z.infer<typeof collectionActionValidation>;
      isLoading?: boolean;
    }
  | { mode: FormMode.CREATE };

export function CollectionActionForm(props: CollectionActionForm) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { org, col, id } = useParams();
  const isCreateMode = props.mode === FormMode.CREATE;
  const data = !isCreateMode ? props.data : undefined;
  const isLoading = !isCreateMode ? props.isLoading : undefined;

  const schema = submitButtonValidation.merge(collectionActionValidation);

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const { handleSubmit, register, reset, setError } = methods;

  const collectionActionsQueryKey = getCollectionActionsQueryKey({
    org,
    col,
    limit: 10,
    offset: 0,
  });
  const collectionActionDocumentQueryKey = getCollectionActionDocumentQueryKey({
    org,
    col,
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
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

      if (id)
        return await endpoint.put(
          `/organisations/${org}/collections/${col}/dev/actions/${id}`,
          data,
        );

      return await endpoint.post(
        `/organisations/${org}/collections/${col}/dev/actions`,
        data,
      );
    },
    onSuccess: (_, values) => {
      const document_submit_type_value = values[SUBMIT_BUTTON_KEY];

      if (document_submit_type_value === DocumentSubmitType.SAVE) {
        queryClient.invalidateQueries({
          queryKey: collectionActionsQueryKey,
        });

        router.push(`/organisations/${org}/collections/${col}/actions`);
      } else reset();

      queryClient.invalidateQueries({
        queryKey: collectionActionDocumentQueryKey,
      });

      toast.success("Operation successfully completed");
    },
    onError: (error) => handleError(error, setError),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (data) reset(data);
  }, [data]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(
          (values) => mutation.mutateAsync(values),
          console.error,
        )}
        className="w-full flex flex-col gap-3 md:gap-4 lg:gap-5 xl:gap-6"
      >
        <div className="w-full flex flex-col gap-3 md:gap-4 lg:gap-5 xl:gap-6 max-w-4xl mx-auto">
          {isLoading ? (
            <LoadingSkeletons count={5} />
          ) : (
            <>
              <FieldWrapper name="name" label="Name" isRequired>
                <InputField {...register("name")} />
              </FieldWrapper>
              <FieldWrapper name="icon" label="Icon" isRequired>
                <InputField {...register("icon")} />
              </FieldWrapper>
              <FieldWrapper name="label" label="Label" isRequired>
                <InputField {...register("label")} />
              </FieldWrapper>
              <LevelField />
              <FieldWrapper name="endpoint" label="Endpoint" isRequired>
                <InputField type="url" {...register("endpoint")} />
              </FieldWrapper>
            </>
          )}
        </div>
        <FormFooter mode={props.mode} />
      </form>
    </FormProvider>
  );
}
