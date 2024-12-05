"use client";
import { BlockWrapper, quackFields } from "@duck-form/fields";
import {
  CollectionPermission,
  FileInputField,
  LoadingSkeletons,
  ReferenceField,
  RichTextField,
  endpoint,
  getCollectionDocumentQueryKey,
  getCollectionQueryKey,
  handleError,
  schemaBuilder,
  useAuth,
  useCollectionForm,
} from "@honohub/shared";
import {
  DocumentSubmitType,
  FormMode,
  SUBMIT_BUTTON_KEY,
} from "@honohub/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Blueprint, DuckField, DuckForm } from "duck-form";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { type FieldValues, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { DevToolPanel } from "./DevToolPanel";
import { Footer } from "./Footer";

export type CollectionForm = (
  | {
      mode: FormMode.UPDATE;
      data?: Record<string, any>;
      isLoading?: boolean;
    }
  | { mode: FormMode.CREATE }
) & { open: boolean };

export function CollectionForm(props: CollectionForm) {
  const { org, col, id } = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { profile } = useAuth();
  const isCreateMode = props.mode === FormMode.CREATE;
  const data = !isCreateMode ? props.data : undefined;

  const { data: schemaData, isLoading: isSchemaLoading } = useCollectionForm();

  const methods = useForm({
    defaultValues: data,
  });

  const { handleSubmit, setError, reset } = methods;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const schema = useMemo(() => {
    if (schemaData)
      return schemaBuilder(schemaData, {
        isDev: profile?.dev,
        isReadonly: !(
          profile?.dev ||
          profile?.superuser ||
          (!isCreateMode
            ? profile?.permissions?.[String(col)]?.[CollectionPermission.UPDATE]
            : true)
        ),
      });
  }, [schemaData, profile]);

  const collectionQueryKey = getCollectionQueryKey({
    org,
    col,
    limit: 10,
    offset: 0,
  });

  const collectionItemQueryKey = getCollectionDocumentQueryKey({
    org,
    col,
    id,
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

      if (id)
        return await endpoint.put(
          `/organisations/${org}/collections/${col}/${id}`,
          data,
        );

      return await endpoint.post(
        `/organisations/${org}/collections/${col}`,
        data,
      );
    },
    onSuccess: (_, values) => {
      const document_submit_type_value = values[SUBMIT_BUTTON_KEY];

      if (document_submit_type_value === DocumentSubmitType.SAVE) {
        queryClient.invalidateQueries({
          queryKey: collectionQueryKey,
        });

        router.push(`/organisations/${org}/collections/${col}`);
      } else reset();

      queryClient.invalidateQueries({
        queryKey: collectionItemQueryKey,
      });

      toast.success("Operation successfully completed");
    },
    onError: (error) => handleError(error, setError),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (data) reset(data);
    else if (schemaData) reset(schemaData.initial_value);
  }, [data, schemaData]);

  return (
    <div className="flex h-full overflow-hidden gap-3 md:gap-4 lg:gap-5 xl:gap-6">
      <DuckForm
        components={{
          ...quackFields,
          file: FileInputField,
          reference: ReferenceField,
          richtext: RichTextField,
        }}
        generateId={(_, props) => (props.id ? String(props.id) : undefined)}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(
              (values) => mutation.mutateAsync(values),
              console.error,
            )}
            className="w-full flex flex-col gap-3 md:gap-4 lg:gap-5 xl:gap-6 overflow-y-auto rounded-b-lg"
          >
            <div className="w-full flex flex-col gap-3 md:gap-4 lg:gap-5 xl:gap-6 max-w-4xl mx-auto">
              {(!isCreateMode && props.isLoading) || isSchemaLoading ? (
                <LoadingSkeletons count={6} />
              ) : (
                schema && (
                  <Blueprint wrapper={BlockWrapper} schema={schema}>
                    {Object.keys(schema).map((key) => (
                      <DuckField key={key} id={key} />
                    ))}
                  </Blueprint>
                )
              )}
            </div>
            <Footer formMode={props.mode} />
          </form>
          {props.open && <DevToolPanel schema={schema} />}
        </FormProvider>
      </DuckForm>
    </div>
  );
}
