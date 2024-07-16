"use client";
import { useThread } from "@fibr/react";
import { InputField } from "@rafty/ui";
import { useFormContext } from "react-hook-form";
import type { StringProps } from "../types";
import { FieldWrapper, InputWrapper, TooltipWrapper } from "../utils";

export function StringField() {
  const {
    id,
    placeholder,
    inputType = "text",
    inputMode,
  } = useThread<StringProps>();

  const { register } = useFormContext();

  return (
    <TooltipWrapper>
      <FieldWrapper>
        <InputWrapper>
          <InputField
            id={id}
            type={inputType}
            placeholder={placeholder}
            inputMode={inputMode}
            {...register(id)}
          />
        </InputWrapper>
      </FieldWrapper>
    </TooltipWrapper>
  );
}
