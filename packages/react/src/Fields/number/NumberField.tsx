"use client";
import { useThread } from "@fibr/react";
import { InputField } from "@rafty/ui";
import { useFormContext } from "react-hook-form";
import type { NumberProps } from "../types";
import { FieldWrapper, InputWrapper, TooltipWrapper } from "../utils";

export function NumberField() {
  const { id, placeholder, inputMode, min, max } = useThread<NumberProps>();

  const { register } = useFormContext();

  return (
    <TooltipWrapper>
      <FieldWrapper>
        <InputWrapper>
          <InputField
            id={id}
            type="number"
            step="any"
            placeholder={placeholder}
            inputMode={inputMode}
            min={min}
            max={max}
            {...register(id, { valueAsNumber: true })}
          />
        </InputWrapper>
      </FieldWrapper>
    </TooltipWrapper>
  );
}
