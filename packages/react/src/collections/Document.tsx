import { FibrProvider, Thread } from "@fibr/react";
import { Button, Skeleton } from "@rafty/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { blocks } from "../Fields";
import type { CollectionType } from "./types";

export type Document = Omit<CollectionType, "columns"> & {
  serverUrl: string;
  defaultValues?: any;
};

enum DocumentSubmitType {
  SAVE_AND_ADD_ANOTHER = "save_and_add_another",
  SAVE = "save",
}

enum FormType {
  CREATE = "Create",
  EDIT = "Edit",
}

const document_submit_type_key = "_submit_btn";

export function Document({ fields, slug, serverUrl, defaultValues }: Document) {
  const { id } = useParams();
  const formType = id === "create" ? FormType.CREATE : FormType.EDIT;

  const { data, isLoading } = useQuery({
    queryKey: ["launch"],
    queryFn: () =>
      axios.get(`${serverUrl}/${slug}/${id}`).then((res) => res.data),
    enabled: formType === FormType.EDIT,
  });

  const methods = useForm({
    defaultValues,
  });

  const { handleSubmit, reset, setValue } = methods;

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{formType}</h1>
      <FormProvider {...methods}>
        <FibrProvider plugins={blocks}>
          <form
            onSubmit={handleSubmit((values) => {
              const document_submit_type_value =
                values[document_submit_type_key];
              values[document_submit_type_key] = undefined;

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
            <div className="space-y-5 max-w-4xl py-4 mx-auto">
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
            <div className="flex justify-end gap-4 p-2 bg-secondary-100 rounded-md">
              <Button
                type="submit"
                variant="ghost"
                colorScheme="primary"
                onClick={() =>
                  setValue(
                    document_submit_type_key,
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
                  setValue(document_submit_type_key, DocumentSubmitType.SAVE)
                }
              >
                Submit
              </Button>
            </div>
          </form>
        </FibrProvider>
      </FormProvider>
    </div>
  );
}
