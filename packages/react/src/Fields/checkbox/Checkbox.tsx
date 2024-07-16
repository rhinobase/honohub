"use client";
import { useThread } from "@fibr/react";
import { Checkbox as RaftyCheckbox } from "@rafty/ui";
import { Controller, useFormContext } from "react-hook-form";
import type { CheckboxProps } from "../types";
import { FieldWrapper, TooltipWrapper } from "../utils";

export function Checkbox() {
  const { id } = useThread<CheckboxProps>();

  const { control } = useFormContext();

  return (
    <TooltipWrapper>
      <FieldWrapper className="[&>div]:items-start">
        <Controller
          name={id}
          control={control}
          render={({ field: { name, onChange, ref, value, disabled } }) => (
            <RaftyCheckbox
              id={name}
              name={name}
              checked={value}
              onCheckedChange={onChange}
              isDisabled={disabled}
              ref={ref}
            />
          )}
        />
      </FieldWrapper>
    </TooltipWrapper>
  );
}
