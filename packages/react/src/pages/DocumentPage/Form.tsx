import { BlockWrapper, quackFields } from "@duck-form/fields";
import {
  DocumentSubmitType,
  FormFooter,
  FormMode,
  SUBMIT_BUTTON_KEY,
} from "@honohub/shared";
import { Skeleton, Toast } from "@rafty/ui";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Blueprint, DuckField, DuckForm } from "duck-form";
import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { ZodError } from "zod";
import { ReferenceField } from "../../fields";
import { useServer } from "../../providers";
import type { CollectionType } from "../../types";

export type DocumentForm = Pick<CollectionType, "fields" | "slug"> & {
  isLoading: boolean;
};

export function DocumentForm({ slug, fields, isLoading }: DocumentForm) {
  const navigate = useNavigate();
  const { endpoint } = useServer();
  const { id } = useParams();
  const formType = id === "create" ? FormMode.CREATE : FormMode.UPDATE;

  const { handleSubmit, reset, setError } = useFormContext();

  return (
    <DuckForm
      components={{
        ...quackFields,
        reference: ReferenceField,
      }}
      generateId={(_, props) => (props ? String(props.id) : undefined)}
    >
      <form
        onSubmit={handleSubmit(async (values) => {
          const document_submit_type_value = values[SUBMIT_BUTTON_KEY];
          values[SUBMIT_BUTTON_KEY] = undefined;

          try {
            if (formType === FormMode.CREATE)
              await endpoint.post(`/collections/${slug}`, values);
            else await endpoint.put(`/collections/${slug}/${id}`, values);

            if (
              document_submit_type_value ===
              DocumentSubmitType.SAVE_AND_ADD_ANOTHER
            )
              reset();
            else navigate(`/collections/${slug}`);

            toast.custom(({ visible }) => (
              <Toast
                severity="success"
                title="Document added successfully"
                visible={visible}
              />
            ));
          } catch (err) {
            console.error(err);

            if (isAxiosError(err)) {
              const errorResponse = err.response?.data.error;

              if (
                errorResponse &&
                typeof errorResponse === "object" &&
                "name" in errorResponse &&
                "issues" in errorResponse &&
                errorResponse.name === "ZodError" &&
                Array.isArray(errorResponse.issues)
              ) {
                const zodError = ZodError.create(errorResponse.issues);

                for (const issue of zodError.issues) {
                  const name = issue.path.join(".");
                  setError(name, {
                    type: issue.code,
                    message: issue.message,
                  });
                }
              } else
                toast.custom(({ visible }) => (
                  <Toast
                    severity="error"
                    title={`${err.response?.status} ${err.code}`}
                    message={err.response?.statusText}
                    visible={visible}
                  />
                ));
            } else
              toast.custom(({ visible }) => (
                <Toast
                  severity="error"
                  title="Something went wrong!"
                  visible={visible}
                />
              ));
          }
        })}
        className="w-full flex flex-col gap-3 md:gap-4 lg:gap-5 xl:gap-6 overflow-y-auto rounded-b-lg"
      >
        <div className="space-y-3 max-w-4xl py-4 mx-auto w-full">
          {isLoading ? (
            Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={`${i}-${"loading"}`} className="w-full h-10" />
            ))
          ) : (
            <Blueprint wrapper={BlockWrapper}>
              {fields.map((props) => (
                <DuckField key={props.name} id={props.name} {...props} />
              ))}
            </Blueprint>
          )}
        </div>
        <FormFooter mode={formType} onDelete={async () => undefined} />
      </form>
    </DuckForm>
  );
}
