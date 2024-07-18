import { useThread } from "@fibr/react";
import { DatePicker } from "@rafty/ui";
import { Controller, useFormContext } from "react-hook-form";
import type { DateFieldProps } from "../types";
import { FieldWrapper, InputWrapper, TooltipWrapper } from "../utils";

export function DateField() {
  const { id, placeholder } = useThread<DateFieldProps>();
  const { control } = useFormContext();

  return (
    <TooltipWrapper>
      <FieldWrapper>
        <InputWrapper>
          <Controller
            name={id}
            control={control}
            render={({ field: { onChange, value, ...props } }) => {
              const newValue = value ? value.substr(0, 10) : "";

              return (
                <DatePicker
                  {...props}
                  placeholder={placeholder}
                  value={newValue}
                  onValueChange={onChange}
                />
              );
            }}
          />
        </InputWrapper>
      </FieldWrapper>
    </TooltipWrapper>
  );
}
