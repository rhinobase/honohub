"use client";
import { Checkbox, FieldWrapper } from "@rafty/ui";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type z from "zod";
import type { organizationValidation as schema } from "../../../validations";

export function TemplateFieldOptions() {
  const { control } = useFormContext<z.infer<typeof schema>>();

  const templateOrganizationValue = useWatch({
    control,
    name: "template.organisation",
  });

  if (templateOrganizationValue)
    return (
      <>
        <p className="text-secondary-600 dark:text-secondary-400 text-xs font-medium">
          All the collections of this organisation will be cloned.
        </p>
        <FieldWrapper
          name="template.role"
          label="Role"
          orientation="row-reverse"
        >
          <Controller
            name="template.role"
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
      </>
    );

  return null;
}
