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
  serverUrl: string;
  defaultValues?: any;
};

export function DocumentPage({
  fields,
  slug,
  serverUrl,
  defaultValues,
  label,
}: DocumentPage) {
  const { id } = useParams();
  const formType = id === "create" ? FormType.CREATE : FormType.EDIT;

  const { data, isLoading } = useQuery({
    queryKey: [slug, id],
    queryFn: () =>
      axios
        .get(new URL(`${slug}/${id}`, serverUrl).href)
        .then((res) => res.data),
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
