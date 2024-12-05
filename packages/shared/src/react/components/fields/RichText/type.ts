import type { ValueOrFunction } from "@rafty/ui";

export type RichTextProps = {
  type: "richtext";
  defaultValue?: any;
  readOnly?: ValueOrFunction;
};
