import { FibrProvider, Thread } from "@fibr/react";
import { Button } from "@rafty/ui";
import { FormProvider, useForm } from "react-hook-form";
import { blocks } from "../Fields";
import type { CollectionType } from "./types";

export type Edit = Omit<CollectionType, "columns">;

export function Edit({ fields }: Edit) {
  const methods = useForm();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const isReadOnly = false;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{isReadOnly ? "View" : "Edit"}</h1>
      <FormProvider {...methods}>
        <FibrProvider plugins={blocks}>
          <form onSubmit={handleSubmit(console.log)} className="space-y-3">
            {fields.map((props) => (
              <Thread key={props.name} id={props.name} {...props} />
            ))}
            <Button
              type="submit"
              colorScheme="primary"
              isLoading={isSubmitting}
              className="ml-auto"
            >
              Save
            </Button>
          </form>
        </FibrProvider>
      </FormProvider>
    </div>
  );
}
