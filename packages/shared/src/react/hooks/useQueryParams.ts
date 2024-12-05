"use client";
import { queryValidation } from "../validations";
import { useSearchParams } from "next/navigation";
import type z from "zod";

export function useQueryParams<T extends z.ZodType = typeof queryValidation>(
  validation: T = queryValidation as unknown as T
): z.infer<T> {
  const searchParams = useSearchParams();

  return validation.parse(Object.fromEntries(searchParams.entries()));
}
