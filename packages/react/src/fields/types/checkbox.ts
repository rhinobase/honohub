import type { getCheckboxValidation } from "../validations";

type ValidationType = ReturnType<typeof getCheckboxValidation>;
export type CheckboxProps = {
  type: "boolean";
  defaultValue?: boolean;
  validation?: ValidationType;
};
