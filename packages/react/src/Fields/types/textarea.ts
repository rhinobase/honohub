import type { getTextareaValidation } from "../validations";

type ValidationType = ReturnType<typeof getTextareaValidation>;
export type TextareaProps = {
  type: "textarea";
  placeholder?: string;
  defaultValue?: string;
  validation?: ValidationType;
};
