import { FibrProvider, Thread } from "@fibr/react";
import { Button } from "@rafty/ui";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { blocks } from "../Fields";
import type { CollectionType } from "./types";

export type Create = Omit<CollectionType, "columns">;

enum DocumentSubmitType {
  SAVE_AND_ADD_ANOTHER = "save_and_add_another",
  SAVE = "save",
}

const document_submit_type_key = "_submit_btn";

export function Create({ fields, slug }: Create) {
  const methods = useForm();
  const navigate = useNavigate();

  const { handleSubmit, reset, setValue } = methods;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Create</h1>
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
            className="space-y-3"
          >
            {fields.map((props) => (
              <Thread key={props.name} id={props.name} {...props} />
            ))}
            <div className="flex justify-end gap-3">
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
