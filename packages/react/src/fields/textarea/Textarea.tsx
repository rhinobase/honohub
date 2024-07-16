"use client";
import { useThread } from "@fibr/react";
import { Textarea as TextareaField } from "@rafty/ui";
import { useFormContext } from "react-hook-form";
import type { TextareaProps } from "../types";
import { FieldWrapper, TooltipWrapper } from "../utils";

export function Textarea() {
  const { id, placeholder } = useThread<TextareaProps>();

  const { register } = useFormContext();

  return (
    <TooltipWrapper>
      <FieldWrapper>
        <TextareaField id={id} placeholder={placeholder} {...register(id)} />
      </FieldWrapper>
    </TooltipWrapper>
  );
}
