import { useThread } from "@fibr/react";
import { InputField } from "@rafty/ui";
import { useFormContext } from "react-hook-form";
import type { DatetimeFieldProps } from "../types";
import { FieldWrapper, InputWrapper, TooltipWrapper } from "../utils";

export function DatetimeField() {
  const { id, placeholder } = useThread<DatetimeFieldProps>();

  const { register } = useFormContext();

  return (
    <TooltipWrapper>
      <FieldWrapper>
        <InputWrapper>
          <InputField
            id={id}
            type="datetime-local"
            placeholder={placeholder}
            {...register(id)}
          />
        </InputWrapper>
      </FieldWrapper>
    </TooltipWrapper>
  );
}
