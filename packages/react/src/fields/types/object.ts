import type { ZodObject } from "zod";
import type { DefaultValue } from "./defaultValue";
import type { FieldProps } from "./fieldProps";
import type { Prettify } from "./utils";
import type { Validation } from "./validation";

export interface ObjectProps<
  T extends Record<string, FieldProps> = Record<string, FieldProps>,
> {
  type: "object";
  blocks: T;
  defaultValue?: Prettify<DefaultValue<T>>;
  validation?: Prettify<ZodObject<Validation<T>>>;
}
