import type { CheckboxProps } from "./checkbox";
import type { CustomFieldProps } from "./custom";
import type { DateFieldProps } from "./date";
import type { DatetimeFieldProps } from "./datetime";
import type { NumberProps } from "./number";
import type { ObjectProps } from "./object";
import type { SelectProps } from "./select";
import type { StringProps } from "./string";
import type { TextareaProps } from "./textarea";
import type { GeneralWrapperProps, InputWrapperProps } from "./wrappers";

export type FieldProps =
  | GeneralWrapperProps<CheckboxProps>
  | GeneralWrapperProps<DateFieldProps & InputWrapperProps>
  | GeneralWrapperProps<DatetimeFieldProps & InputWrapperProps>
  | ObjectProps
  | GeneralWrapperProps<NumberProps & InputWrapperProps>
  | GeneralWrapperProps<SelectProps>
  | GeneralWrapperProps<StringProps & InputWrapperProps>
  | GeneralWrapperProps<TextareaProps>
  | CustomFieldProps;

export type FieldPropsMap = {
  [K in FieldProps["type"]]: Extract<FieldProps, { type: K }>;
};
