"use client";
import { useThread } from "@fibr/react";
import {
  FieldWrapper as RaftyFieldWrapper,
  classNames,
  getValue,
} from "@rafty/ui";
import type { PropsWithChildren } from "react";
import { useFormContext } from "react-hook-form";
import type { FieldWrapperProps } from "../types";

export type FieldWrapper = PropsWithChildren<{
  className?: RaftyFieldWrapper["className"];
}>;

export function FieldWrapper({ className, children }: FieldWrapper) {
  const {
    id,
    disabled,
    required,
    readonly,
    hidden,
    orientation,
    label,
    description,
  } = useThread<FieldWrapperProps>();

  const { watch } = useFormContext();

  const values = watch();
  const isHidden = getValue(hidden, values);

  return (
    <RaftyFieldWrapper
      name={id}
      isDisabled={disabled}
      isRequired={required}
      isReadOnly={readonly}
      className={classNames(isHidden && "hidden", "relative", className)}
      orientation={orientation}
      label={label}
      description={description}
    >
      {children}
    </RaftyFieldWrapper>
  );
}
