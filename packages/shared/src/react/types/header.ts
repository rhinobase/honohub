export type HeaderType = (
  | BasicHeaderType
  | CommonHeaderType
  | ReferenceHeaderType
  | ArrayHeaderType
  | ObjectHeaderType
  | FileHeaderType
) & {
  name: string;
  title?: string;
};

type BasicHeaderType = {
  type: "pin" | "boolean" | "date" | "datetime" | "user";
};

export type CommonHeaderType = {
  type: "string" | "number";
  options?: {
    list: { title: string; value: string }[];
  };
};

export type ArrayHeaderType = {
  type: "array";
  of: HeaderType[];
  order?: -1 | 1;
};

export type ReferenceHeaderType = {
  type: "reference";
  to: {
    collection: string;
    collection_id: string;
    field: string;
  };
};

export type ObjectHeaderType = {
  type: "object";
  fields: HeaderType[];
};

type FileHeaderType = {
  type: "file" | "image" | "video";
  multiple?: boolean;
};
