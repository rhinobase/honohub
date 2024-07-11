import { getValue } from "@rafty/ui";
import {
  type ZodDefault,
  type ZodLiteral,
  type ZodOptional,
  type ZodSchema,
  type ZodString,
  type ZodUnion,
  z,
} from "zod";
import { getDateDefaultValue, getDatetimeDefaultValue } from "./defaultValues";
import type {
  CheckboxProps,
  DateFieldProps,
  DatetimeFieldProps,
  FieldProps,
  FieldWrapperProps,
  NumberProps,
  Prettify,
  SelectProps,
  StringProps,
  TextareaProps,
  Validation,
} from "./types";

type ZodWrapper<T extends ZodSchema> =
  | T
  | ZodDefault<T>
  | ZodOptional<T | ZodDefault<T>>;

export function getCheckboxValidation(
  block: CheckboxProps & FieldWrapperProps,
) {
  const validation = z.boolean();

  const isRequired = getValue(block.required);

  if (block.defaultValue) return validation.default(block.defaultValue);

  if (!isRequired) return z.optional(validation);

  return validation;
}

export function getDateValidation(block: DateFieldProps & FieldWrapperProps) {
  let validation:
    | ZodDefault<z.ZodString>
    | z.ZodString
    | ZodOptional<z.ZodString | ZodDefault<z.ZodString>> = z.string();

  const defaultValue = getDateDefaultValue(block);
  const isRequired = getValue(block.required);

  if (defaultValue) validation = validation.default(defaultValue);

  if (!isRequired) validation = z.optional(validation);

  return z.preprocess(
    (val) =>
      val != null && val !== ""
        ? new Date(String(val)).toISOString().split("T")[0]
        : undefined,
    validation,
  );
}

export function getDatetimeValidation(
  block: DatetimeFieldProps & FieldWrapperProps,
) {
  let validation:
    | ZodDefault<z.ZodString>
    | z.ZodString
    | ZodOptional<z.ZodString | ZodDefault<z.ZodString>> = z.string();

  const defaultValue = getDatetimeDefaultValue(block);
  const isRequired = getValue(block.required);

  if (defaultValue) validation = validation.default(defaultValue);

  if (!isRequired) validation = z.optional(validation);

  return z.preprocess(
    (val) =>
      val != null && val !== ""
        ? new Date(String(val)).toLocaleString()
        : undefined,
    validation,
  );
}

export function getObjectValidation<T extends Record<string, FieldProps>>(
  blocks: T,
) {
  const raw_object = Object.entries(blocks).reduce((prev, [name, block]) => {
    const validation = getValidation(block);

    if (validation) prev[name] = validation;

    return prev;
  }, {} as any);

  return z.object<Prettify<Validation<T>>>(raw_object);
}

export function getNumberValidation(block: NumberProps & FieldWrapperProps) {
  let validation:
    | z.ZodDefault<z.ZodNumber>
    | z.ZodNumber
    | z.ZodOptional<
        z.ZodUnion<[z.ZodNumber | ZodDefault<z.ZodNumber>, z.ZodNaN]>
      > = z.coerce.number();

  if (block.min) validation = validation.min(Number(block.min));
  if (block.max) validation = validation.max(Number(block.max));

  const isRequired = getValue(block.required);

  if (block.defaultValue) validation = validation.default(block.defaultValue);

  if (!isRequired) validation = z.union([validation, z.nan()]).optional();

  return validation;
}

export function getSelectValidation(block: SelectProps & FieldWrapperProps) {
  let validation: ZodWrapper<
    z.ZodEffects<
      z.ZodUnion<[z.ZodString, z.ZodNumber]>,
      string | number,
      string | number
    >
  > = z
    .string()
    .or(z.number())
    .refine((val) => {
      if (block.placeholder && val === "") return true;
      return block.options.find(({ value }) => value === val);
    });

  const isRequired = getValue(block.required);

  if (block.defaultValue) validation = validation.default(block.defaultValue);

  if (!isRequired) validation = z.optional(validation);

  return validation;
}

export function getStringValidation(block: StringProps & FieldWrapperProps) {
  let validation:
    | z.ZodString
    | ZodDefault<z.ZodString>
    | ZodUnion<[ZodLiteral<"">, ZodString | ZodDefault<ZodString>]> =
    z.string();

  switch (block.inputType) {
    case "email":
      validation = validation.email();
      break;
    case "url":
      validation = validation.url();
      break;
  }

  if (block.maxLength) validation.min(block.maxLength);
  if (block.minLength) validation.min(block.minLength);

  const isRequired = getValue(block.required);

  if (block.defaultValue) validation = validation.default(block.defaultValue);

  if (!isRequired) validation = z.union([z.literal(""), validation]);

  return validation;
}

export function getTextareaValidation(
  block: TextareaProps & FieldWrapperProps,
) {
  let validation: ZodWrapper<z.ZodString> = z.string();

  const isRequired = getValue(block.required);

  if (block.defaultValue) validation = validation.default(block.defaultValue);

  if (!isRequired) validation = z.optional(validation);

  return validation;
}

export function getValidation<T extends Record<string, FieldProps>>(
  block: FieldProps,
) {
  if ("validation" in block && block.validation) {
    // if (typeof block.validation === "function") return block.validation(block);
    return block.validation;
  }

  switch (block.type) {
    case "checkbox":
      return getCheckboxValidation(block);
    case "date":
      return getDateValidation(block);
    case "object":
      return getObjectValidation<T>(block.blocks as T);
    case "number":
      return getNumberValidation(block);
    case "select":
      return getSelectValidation(block);
    case "string":
      return getStringValidation(block);
    case "textarea":
      return getTextareaValidation(block);
  }

  throw new Error(
    `Unable to find validation for block of type '${block.type}'!`,
  );
}
