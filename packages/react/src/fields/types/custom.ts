import type { ZodSchema } from "zod";
import type { GeneralWrapperProps } from "./wrappers";

export type CustomFieldProps = GeneralWrapperProps<
  {
    type: `custom_${string}`;
    defaultValue?: unknown;
    validation?: ZodSchema;
  } & {
    [K: string]: unknown;
  }
>;
