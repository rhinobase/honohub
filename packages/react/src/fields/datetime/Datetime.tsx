import { useThread } from "@fibr/react";
import { InputField } from "@rafty/ui";
import { Controller, useFormContext } from "react-hook-form";
import type { DatetimeFieldProps } from "../types";
import { FieldWrapper, InputWrapper, TooltipWrapper } from "../utils";

export function DatetimeField() {
  const { id, placeholder } = useThread<DatetimeFieldProps>();
  const { control } = useFormContext();

  return (
    <TooltipWrapper>
      <FieldWrapper>
        <InputWrapper>
          <Controller
            name={id}
            control={control}
            render={({ field: { onChange, value, ...props } }) => {
              const newValue = value ? value.substr(0, 16) : "";

              return (
                <InputField
                  {...props}
                  type="datetime-local"
                  placeholder={placeholder}
                  value={newValue}
                  onChange={onChange}
                />
              );
            }}
          />
        </InputWrapper>
      </FieldWrapper>
    </TooltipWrapper>
  );
}
