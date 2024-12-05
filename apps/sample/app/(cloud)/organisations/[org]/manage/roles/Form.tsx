"use client";
import {
  CollectionsPermissionsField,
  StaticCollection,
  roleValidation,
  submitButtonValidation,
} from "@honohub/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldWrapper, InputField, Textarea } from "@rafty/ui";
import { FormProvider, useForm } from "react-hook-form";
import type z from "zod";
import { ManageFormWrapper } from "../FormWrapper";

const schema = roleValidation.merge(submitButtonValidation);

export type RoleForm = {
  data?: z.infer<typeof roleValidation>;
  isLoading?: boolean;
};

export function RoleForm({ data, isLoading }: RoleForm) {
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const { register } = methods;

  return (
    <FormProvider {...methods}>
      <ManageFormWrapper
        slug={StaticCollection.ROLES}
        data={data}
        isLoading={isLoading}
      >
        <FieldWrapper name="name" label="Name" isRequired>
          <InputField {...register("name")} />
        </FieldWrapper>
        <FieldWrapper name="description" label="Description">
          <Textarea {...register("description")} />
        </FieldWrapper>
        <FieldWrapper name="permissions" label="Permissions">
          <CollectionsPermissionsField />
        </FieldWrapper>
      </ManageFormWrapper>
    </FormProvider>
  );
}
