import type { getSelectValidation } from "../validations";

type ValidationType = ReturnType<typeof getSelectValidation>;
export type SelectProps = {
  type: "select";
  placeholder?: string;
  defaultValue?: string | number;
  options: {
    value: string | number;
    label?: string;
  }[];
  validation?: ValidationType;
};
