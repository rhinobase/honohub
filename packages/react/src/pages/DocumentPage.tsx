import { FibrProvider, Thread } from "@fibr/react";
import { Button, Skeleton, Toast } from "@rafty/ui";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError, isAxiosError } from "axios";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import urlJoin from "url-join";
import { PageTitle } from "../components";
import { blocks } from "../fields";
import { useServer } from "../providers";
import type { CollectionType } from "../types";
import { getSingularLabel } from "../utils";

enum DocumentSubmitType {
  SAVE_AND_ADD_ANOTHER = 1,
  SAVE = 2,
}

enum FormType {
  CREATE = 1,
  EDIT = 2,
}

const SUBMIT_BUTTON_KEY = "_submit_btn";

export type DocumentPage = Omit<CollectionType, "columns"> & {
  defaultValues?: any;
};

export function DocumentPage({
  fields,
  slug,
  defaultValues,
  label,
}: DocumentPage) {
  const { id } = useParams();
  const { endpoint } = useServer();
  const formType = id === "create" ? FormType.CREATE : FormType.EDIT;

  const { data, isLoading } = useQuery({
    queryKey: [slug, id],
    queryFn: () =>
      endpoint.get(urlJoin(slug, id ?? "")).then((res) => res.data),
    enabled: formType === FormType.EDIT,
  });

  const methods = useForm({
    defaultValues,
  });

  const { handleSubmit, reset, setValue } = methods;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (data) reset(data);
  }, [data]);

  const navigate = useNavigate();

  return (
    <>
      <PageTitle>
        {formType === FormType.CREATE ? "Create" : "Edit"}{" "}
        {getSingularLabel(label)}
      </PageTitle>
      <FormProvider {...methods}>
        <FibrProvider plugins={blocks}>
          <form
            onSubmit={handleSubmit(async (values) => {
              const document_submit_type_value = values[SUBMIT_BUTTON_KEY];
              values[SUBMIT_BUTTON_KEY] = undefined;

              try {
                if (formType === FormType.CREATE)
                  await endpoint.post(`/${slug}`, values);
                else await endpoint.put(urlJoin(slug, id ?? ""), values);

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

                if (isAxiosError(err))
                  toast.custom(({ visible }) => (
                    <Toast
                      severity="error"
                      title={`${err.response?.status} ${err.code}`}
                      message={err.response?.statusText}
                      visible={visible}
                    />
                  ));
              }
            })}
            className="space-y-4"
          >
            <div className="space-y-3 max-w-4xl py-4 mx-auto">
              {isLoading
                ? Array.from({ length: 8 }, (_, i) => (
                    <Skeleton
                      key={`${i}-${"loading"}`}
                      className="w-full h-10"
                    />
                  ))
                : fields.map((props) => (
                    <Thread key={props.name} id={props.name} {...props} />
                  ))}
            </div>
            <div className="flex justify-end gap-4 p-2 bg-secondary-100 dark:bg-secondary-900 rounded-md">
              <Button
                type="submit"
                variant="ghost"
                colorScheme="primary"
                onClick={() =>
                  setValue(
                    SUBMIT_BUTTON_KEY,
                    DocumentSubmitType.SAVE_AND_ADD_ANOTHER,
                  )
                }
              >
                Save and add another
              </Button>
              <Button
                type="submit"
                colorScheme="primary"
                onClick={() =>
                  setValue(SUBMIT_BUTTON_KEY, DocumentSubmitType.SAVE)
                }
              >
                Submit
              </Button>
            </div>
          </form>
        </FibrProvider>
      </FormProvider>
    </>
  );
}
