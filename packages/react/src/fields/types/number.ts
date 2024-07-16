import type { InputField } from "@rafty/ui";
import type { getNumberValidation } from "../validations";

type ValidationType = ReturnType<typeof getNumberValidation>;
export type NumberProps = {
  type: "number";
  placeholder?: string;
  defaultValue?: number;
  inputMode?: "none" | "numeric" | "decimal";
  min?: InputField["min"];
  max?: InputField["max"];
  validation?: ValidationType;
};
