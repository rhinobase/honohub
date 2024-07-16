import type {
  DateFieldProps,
  DatetimeFieldProps,
  DefaultValue,
  FieldProps,
  Prettify,
} from "./types";

export const getObjectDefaultValue = <T extends Record<string, FieldProps>>(
  blocks: T,
): Prettify<DefaultValue<T>> =>
  Object.entries(blocks).reduce((prev, [name, block]) => {
    const value = getDefaultValue(block);

    if (value != null) prev[name] = value;

    return prev;
  }, {} as any);

export const getDateDefaultValue = (block: DateFieldProps) => {
  if (block.defaultValue)
    return new Date(block.defaultValue).toISOString().split("T")[0];
};

export const getDatetimeDefaultValue = (block: DatetimeFieldProps) => {
  if (block.defaultValue) return new Date(block.defaultValue).toLocaleString();
};

function getComponentDefaultValue(block: FieldProps) {
  return block.defaultValue;
}

export function getDefaultValue<T extends Record<string, FieldProps>>(
  block: FieldProps,
) {
  if (block.type === "date") return getDateDefaultValue(block);
  if (block.type === "datetime") return getDatetimeDefaultValue(block);

  if (block.type === "object")
    return getObjectDefaultValue<T>(block.blocks as T);

  return getComponentDefaultValue(block);
}
