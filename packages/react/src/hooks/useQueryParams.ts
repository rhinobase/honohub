import { useSearchParams } from "react-router-dom";
import type z from "zod";
import { queryValidation } from "../validations";

export function useQueryParams<T extends z.ZodType = typeof queryValidation>(
  validation: T = queryValidation as unknown as T,
): z.infer<T> {
  const [searchParams] = useSearchParams();

  return validation.parse(Object.fromEntries(searchParams.entries()));
}
