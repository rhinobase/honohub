import { Checkbox } from "./checkbox";
import { DateField } from "./date";
import { DatetimeField } from "./datetime";
import { NumberField } from "./number";
import { ObjectField } from "./object";
import { Select } from "./select";
import { StringField } from "./string";
import { Textarea } from "./textarea";
import type { FieldProps } from "./types";

export const blocks: Record<FieldProps["type"], () => JSX.Element> = {
  object: ObjectField,
  date: DateField,
  number: NumberField,
  select: Select,
  textarea: Textarea,
  boolean: Checkbox,
  string: StringField,
  datetime: DatetimeField,
};
