import type { getDateValidation } from "../validations";

type ValidationType = ReturnType<typeof getDateValidation>;

export type DatetimeFieldProps = {
  type: "datetime";
  placeholder?: string;
  defaultValue?: string | Date;
  validation?: ValidationType;
};
