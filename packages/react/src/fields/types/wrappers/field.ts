import type { FieldWrapper, ValueOrFunction } from "@rafty/ui";

export type FieldWrapperProps = {
  label?: string;
  description?: string;
  primary?: boolean;
  unique?: boolean;
  required?: ValueOrFunction<boolean>;
  disabled?: ValueOrFunction<boolean>;
  readonly?: ValueOrFunction<boolean>;
  hidden?: ValueOrFunction<boolean>;
  orientation?: FieldWrapper["orientation"];
};
