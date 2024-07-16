import type { InputField } from "@rafty/ui";
import type { getStringValidation } from "../validations";

type ValidationType = ReturnType<typeof getStringValidation>;

export type StringProps = {
  type: "string";
  inputType?: InputField["type"];
  placeholder?: string;
  defaultValue?: string;
  inputMode?: InputField["inputMode"];
  maxLength?: number;
  minLength?: number;
  validation?: ValidationType;
};
