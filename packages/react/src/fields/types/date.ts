import type { getDateValidation } from "../validations";

type ValidationType = ReturnType<typeof getDateValidation>;
export type DateFieldProps = {
  type: "date";
  placeholder?: string;
  defaultValue?: string | Date;
  validation?: ValidationType;
};
