import type {
  ArrayProps,
  CheckboxGroupProps,
  CheckboxProps,
  DateFieldProps,
  FieldProps,
  FieldWrapperProps,
  InputWrapperProps,
  NumberProps,
  ObjectProps,
  PinInputProps,
  RadioGroupProps,
  SelectProps,
  StringProps,
  TagFieldProps,
  TextareaProps,
} from "@duck-form/fields";
import type {
  FileInputFieldProps,
  ReferenceFieldProps,
  RichTextProps,
} from "../components/fields";
import type {
  CollectionArrayField,
  CollectionBasicField,
  CollectionCheckboxGroupField,
  CollectionCommonField,
  CollectionFieldSchema,
  CollectionFieldType,
  CollectionFileField,
  CollectionObjectField,
  CollectionPinField,
  CollectionReferenceField,
} from "../types";

export function schemaBuilder(
  collectionConfig: CollectionFieldType,
  options?: {
    isDev?: boolean;
    isReadonly?: boolean;
  },
): Record<string, FieldProps> {
  const updatedSchema: [string, FieldProps][] = [];

  const { schema, validation, on_change } = collectionConfig;

  for (const field of schema) {
    const onChange = on_change?.[field.name];

    const payload: CollectionFieldSchema &
      FieldWrapperProps & { legacyOnChange: () => void } = {
      ...field,
      readonly: options?.isReadonly,
      required: validation?.includes(field.name),
      // biome-ignore lint/security/noGlobalEval: Legacy code
      legacyOnChange: onChange ? eval(onChange) : undefined,
    };

    switch (payload.type) {
      case "object":
        updatedSchema.push([
          payload.name,
          transformObjectField(payload, collectionConfig),
        ]);
        break;
      case "boolean":
      case "date":
      case "text":
      case "tag":
      case "richtext":
        // @ts-expect-error
        updatedSchema.push([payload.name, transformSimpleField(payload)]);
        break;
      case "video":
      case "image":
      case "file":
        // @ts-expect-error
        updatedSchema.push([payload.name, transformFileField(payload)]);
        break;
      case "string":
      case "number":
        updatedSchema.push([payload.name, transformBasicField(payload)]);
        break;
      case "array":
        updatedSchema.push([
          payload.name,
          transformArrayField(payload, collectionConfig),
        ]);
        break;
      case "pin":
        updatedSchema.push([payload.name, transformPinField(payload)]);
        break;
      case "checkboxgroup":
        updatedSchema.push([
          payload.name,
          transformCheckboxGroupField(payload),
        ]);
        break;
      case "reference":
        // @ts-expect-error
        updatedSchema.push([payload.name, transformReferenceField(payload)]);
        break;
      default:
        updatedSchema.push([
          // @ts-expect-error
          payload.name,
          payload,
        ]);
        break;
    }
  }

  return Object.fromEntries(updatedSchema);
}

function transformCheckboxGroupField(
  field: CollectionCheckboxGroupField & FieldWrapperProps,
): FieldWrapperProps & CheckboxGroupProps {
  return {
    ...field,
    type: "checkboxgroup",
    label: field.title,
    options:
      field.options?.list.map((option) => ({
        value: option.value,
        label: option.title,
      })) ?? [],
  };
}

function transformPinField(
  field: CollectionPinField & FieldWrapperProps,
): FieldWrapperProps & PinInputProps {
  return {
    ...field,
    type: "pin",
    label: field.title,
  };
}

function transformObjectField(
  field: CollectionObjectField & FieldWrapperProps,
  options: CollectionFieldType,
): FieldWrapperProps & ObjectProps {
  return {
    ...field,
    label: field.title,
    fieldsets: field.fieldsets?.map(({ name, title }) => ({
      name: name,
      label: title,
    })),
    fields: schemaBuilder({
      ...options,
      schema: field.fields,
    }),
  };
}

function transformSimpleField(
  field: CollectionCommonField & FieldWrapperProps,
): FieldWrapperProps &
  (
    | DateFieldProps
    | CheckboxProps
    | TextareaProps
    | TagFieldProps
    | RichTextProps
  ) {
  const type = field.type === "text" ? "textarea" : field.type;

  return {
    ...field,
    type,
    label: field.title,
  };
}

function transformBasicField(
  field: CollectionBasicField & FieldWrapperProps,
): FieldWrapperProps &
  (
    | (StringProps & InputWrapperProps)
    | (NumberProps & InputWrapperProps)
    | SelectProps
    | CheckboxGroupProps
    | RadioGroupProps
  ) {
  const item = {
    ...field,
    label: field.title,
    prefix: field.options?.prefix,
  };

  if (!field.options?.list) return item;

  if (field.options.layout === "radio") {
    return {
      ...item,
      type: "radio",
      orientaion: field.options.orientation,
      options: field.options.list.map((option) => ({
        value: option.value,
        label: option.title,
      })),
    };
  }

  if (field.options.layout === "checkbox") {
    return {
      ...item,
      type: "checkboxgroup",
      options: field.options.list.map((option) => ({
        value: option.value,
        label: option.title,
      })),
    };
  }

  return {
    ...item,
    type: "select",
    options: field.options.list.map((option) => ({
      value: option.value,
      label: option.title,
    })),
  };
}

function transformFileField(
  field: CollectionFileField & FieldWrapperProps,
): FieldWrapperProps & FileInputFieldProps {
  return {
    ...field,
    type: "file",
    label: field.title,
  };
}

function transformArrayField(
  field: CollectionArrayField & FieldWrapperProps,
  options: CollectionFieldType,
): FieldWrapperProps & ArrayProps {
  const ofSchema = schemaBuilder({
    ...options,
    schema: field.of,
  });

  return {
    ...field,
    label: field.title,
    of: Object.values(ofSchema)[0],
  };
}

function transformReferenceField(
  field: CollectionReferenceField & FieldWrapperProps,
): FieldWrapperProps & ReferenceFieldProps {
  return {
    ...field,
    label: field.title,
    to: {
      collection: field.to.collection,
      field: field.to.field,
      collection_id: field.to.collection_id,
    },
  };
}
