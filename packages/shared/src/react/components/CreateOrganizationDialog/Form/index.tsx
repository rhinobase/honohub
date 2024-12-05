"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  DialogClose,
  DialogFooter,
  FieldWrapper,
  InputField,
} from "@rafty/ui";
import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type z from "zod";
import { endpoint, handleError } from "../../../utils";
import { organizationValidation as schema } from "../../../validations";
import { TemplateField } from "./TemplateField";
import { TemplateFieldOptions } from "./TemplateOptions";

export type CreateOrganizationForm = {
  onSubmit: () => void;
};

export function CreateOrganizationForm(props: CreateOrganizationForm) {
  const router = useRouter();

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
    setError,
    control,
  } = methods;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(async (values) => {
          try {
            await endpoint.post("/organisations", values).then((res) => {
              router.push(`/organisations/${res.data.slug}`);
              toast.success("Organization created successfully");
              props.onSubmit();
            });
          } catch (err) {
            handleError(err, setError);
          }
        }, console.error)}
        className="space-y-2 md:space-y-3 w-full"
      >
        <FieldWrapper
          name="name"
          label="App Name"
          description="Let's start with a name for your project"
          isRequired
        >
          <InputField {...register("name")} />
        </FieldWrapper>
        <FieldWrapper
          name="slug"
          label="Slug"
          description="Unique identifier for the organization"
        >
          <InputField {...register("slug")} />
        </FieldWrapper>
        <TemplateField />
        <TemplateFieldOptions />
        <FieldWrapper
          name="report"
          label="Reports"
          description="Enable Power BI reports"
          orientation="row-reverse"
          className="[&>div]:gap-2.5"
        >
          <Controller
            name="report"
            control={control}
            render={({ field: { name, value, onChange, ref, disabled } }) => (
              <Checkbox
                id={name}
                checked={value}
                onCheckedChange={onChange}
                isDisabled={disabled}
                ref={ref}
              />
            )}
          />
        </FieldWrapper>
        <DialogFooter className="justify-end gap-2 md:gap-3 lg:gap-4 !mt-3 md:!mt-4 lg:!mt-5">
          <DialogClose asChild>
            <Button type="button">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            colorScheme="primary"
            loadingText="Creating"
            isLoading={isSubmitting}
          >
            Create
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
