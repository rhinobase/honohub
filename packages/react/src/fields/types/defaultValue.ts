import type { FieldProps, FieldPropsMap } from "./fieldProps";
import type { ObjectProps } from "./object";

export type DefaultValue<T extends Record<string, FieldProps>> = {
  [K in keyof T]?: T[K] extends { blocks: Record<string, FieldProps> }
    ? ObjectProps<T[K]["blocks"]>["defaultValue"]
    : FieldPropsMap[T[K]["type"]]["defaultValue"];
};
