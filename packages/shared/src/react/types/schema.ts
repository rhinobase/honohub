export type CollectionFieldSchema =
  | CollectionCommonField
  | CollectionBasicField
  | CollectionFileField
  | CollectionObjectField
  | CollectionArrayField
  | CollectionReferenceField
  | CollectionPinField
  | CollectionCheckboxGroupField;

export type CollectionCommonField = {
  type: "date" | "boolean" | "tag" | "richtext" | "text";
  name: string;
  title?: string;
};

export type CollectionCheckboxGroupField = {
  type: "checkboxgroup";
  name: string;
  title?: string;
  options?: {
    list: {
      value: string | number;
      title: string;
    }[];
  };
};

export type CollectionPinField = {
  type: "pin";
  name: string;
  title?: string;
  length: number;
};

export type CollectionBasicField = {
  type: "string" | "number";
  name: string;
  title?: string;
  options?: {
    list: {
      value: string | number;
      title: string;
    }[];
    orientation?: "horizontal" | "vertical";
    layout?: "dropdown" | "radio" | "checkbox";
    prefix?: string;
  };
};

export type CollectionFileField = {
  type: "file" | "video" | "image";
  name: string;
  title?: string;
  options?: {
    multiple?: boolean;
    sources?: string[];
  };
};

export type CollectionObjectField = {
  type: "object";
  name: string;
  title?: string;
  fields: CollectionFieldSchema[];
  fieldsets?: { name: string; title: string }[];
};

export type CollectionArrayField = {
  type: "array";
  name: string;
  title?: string;
  of: CollectionFieldSchema[];
};

export type CollectionReferenceField = {
  type: "reference";
  name: string;
  title?: string;
  to: {
    collection: string;
    collection_id: string;
    field: string;
  };
};

export type CollectionFieldType = {
  schema: CollectionFieldSchema[];
  on_change?: Record<string, string>;
  initial_value?: Record<string, unknown>;
  validation: string[];
};
