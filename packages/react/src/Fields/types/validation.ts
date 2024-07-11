import type { FieldProps, FieldPropsMap } from "./fieldProps";
import type { ObjectProps } from "./object";

export type Validation<T extends Record<string, FieldProps>> = {
  [K in keyof T]: T[K] extends { blocks: Record<string, FieldProps> }
    ? NonNullable<ObjectProps<T[K]["blocks"]>["validation"]>
    : NonNullable<FieldPropsMap[T[K]["type"]]["validation"]>;
};
