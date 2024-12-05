import { collectionIndexValidation as schema } from "@honohub/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, DialogClose, DialogFooter } from "@rafty/ui";
import { FormProvider, useForm } from "react-hook-form";
import type z from "zod";
import { IndexFieldsField } from "./IndexFieldsField";
import { OptionsFields } from "./OptionsFields";

export function CreateIndexForm() {
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      // @ts-expect-error
      fields: [{ name: "", type: "" }],
    },
  });

  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit((values) => console.log(values), console.error)}
        className="space-y-3"
      >
        <IndexFieldsField />
        <OptionsFields />
        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
          <Button type="submit" colorScheme="primary">
            Create Index
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
