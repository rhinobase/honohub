import { FibrProvider, Thread } from "@fibr/react";
import { Button, Skeleton } from "@rafty/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { PageTitle } from "../components";
import { blocks } from "../fields";
import type { CollectionType } from "../types";

enum DocumentSubmitType {
  SAVE_AND_ADD_ANOTHER = "save_and_add_another",
  SAVE = "save",
}

enum FormType {
  CREATE = "Create",
  EDIT = "Edit",
}

const SUBMIT_BUTTON_KEY = "_submit_btn";

export type DocumentPage = Omit<CollectionType, "columns"> & {
  serverUrl: string;
  defaultValues?: any;
};

export function DocumentPage({
  fields,
  slug,
  serverUrl,
  defaultValues,
}: DocumentPage) {
  const { id } = useParams();
  const formType = id === "create" ? FormType.CREATE : FormType.EDIT;

  const { data, isLoading } = useQuery({
    queryKey: [slug, id],
    queryFn: () =>
      axios.get(`${serverUrl}/${slug}/${id}`).then((res) => res.data),
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
      <PageTitle>{formType}</PageTitle>
      <FormProvider {...methods}>
        <FibrProvider plugins={blocks}>
          <form
            onSubmit={handleSubmit((values) => {
              const document_submit_type_value = values[SUBMIT_BUTTON_KEY];
              values[SUBMIT_BUTTON_KEY] = undefined;

              console.log(values);

              if (
                document_submit_type_value ===
                DocumentSubmitType.SAVE_AND_ADD_ANOTHER
              )
                reset();
              else navigate(`/${slug}`);
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
