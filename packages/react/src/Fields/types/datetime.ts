import type { getDatetimeValidation } from "../validations";

type ValidationType = ReturnType<typeof getDatetimeValidation>;

export type DatetimeFieldProps = {
  type: "datetime";
  placeholder?: string;
  defaultValue?: string | Date;
  validation?: ValidationType;
};
