import type { getCheckboxValidation } from "../validations";

type ValidationType = ReturnType<typeof getCheckboxValidation>;
export type CheckboxProps = {
  type: "checkbox";
  defaultValue?: boolean;
  validation?: ValidationType;
};
