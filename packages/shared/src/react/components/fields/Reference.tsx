"use client";
import type { GeneralWrapperProps } from "@duck-form/fields";
import { getValue, useFieldControlContext } from "@rafty/ui";
import { useBlueprint, useDuckForm, useField } from "duck-form";
import { useId, useMemo } from "react";
import { ReferenceFieldComponent } from "../ReferenceField";

export type ReferenceFieldProps = {
  type: "reference";
  to: {
    collection: string;
    collection_id: string;
    field: string;
    organisation?: string;
  };
} & Pick<ReferenceFieldComponent, "legacyOnChange">;

export function ReferenceField() {
  const fieldControlContext = useFieldControlContext() ?? {
    isDisabled: false,
    isLoading: false,
    isReadOnly: false,
    isRequired: false,
    isInvalid: false,
  };

  const props = useField<GeneralWrapperProps<ReferenceFieldProps>>();
  const { generateId } = useDuckForm();
  const { schema } = useBlueprint();

  const autoId = useId();
  const customId = useMemo(
    () => generateId?.(schema, props),
    [generateId, schema, props],
  );

  const id = customId ?? autoId;

  const _readOnly = getValue(props.readonly) ?? fieldControlContext.isReadOnly;
  const _disabled = getValue(props.disabled) ?? fieldControlContext.isDisabled;
  const _invalid = fieldControlContext.isInvalid;
  const _loading = fieldControlContext.isLoading;

  return (
    <ReferenceFieldComponent
      id={id}
      {...props}
      isReadOnly={_readOnly}
      isDisabled={_disabled}
      isInvalid={_invalid}
      isLoading={_loading}
    />
  );
}
