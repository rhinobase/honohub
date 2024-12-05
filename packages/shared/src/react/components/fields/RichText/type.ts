import type { ValueOrFunction } from "@rafty/ui";

export type RichTextProps = {
  type: "richtext";
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  defaultValue?: any;
  readOnly?: ValueOrFunction;
};
