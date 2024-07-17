import { useThread } from "@fibr/react";
import { Select as SelectField, SelectItem } from "@rafty/ui";
import { useFormContext } from "react-hook-form";
import type { SelectProps } from "../types";
import { FieldWrapper, TooltipWrapper } from "../utils";

export function Select() {
  const { id, placeholder, options } = useThread<SelectProps>();

  const { register } = useFormContext();

  return (
    <TooltipWrapper>
      <FieldWrapper className="[&>div]:w-full">
        <SelectField
          id={id}
          placeholder={placeholder}
          {...register(id)}
          className="dark:bg-secondary-950"
        >
          {options.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label ?? value}
            </SelectItem>
          ))}
        </SelectField>
      </FieldWrapper>
    </TooltipWrapper>
  );
}
