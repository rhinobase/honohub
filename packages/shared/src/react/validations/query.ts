import z from "zod";
import { SortOrder } from "../utils";

export const queryValidation = z.object({
  limit: z.coerce.number().min(0).max(100).default(10),
  offset: z.coerce.number().nonnegative().default(0),
  search: z.string().optional(),
  order: z.nativeEnum(SortOrder).optional(),
  orderBy: z.string().optional(),
});

export const baseQueryValidation = queryValidation.omit({
  limit: true,
  offset: true,
});

export const referenceQueryValidation = queryValidation.omit({
  limit: true,
  offset: true,
  search: true,
});

export const activitiesQueryValidation = z
  .object({
    action: z
      .string()
      .optional()
      .transform((val) => val?.split(",")),
    user: z
      .string()
      .optional()
      .transform((val) => val?.split(",")),
    collection: z
      .string()
      .optional()
      .transform((val) => val?.split(",")),
  })
  .merge(queryValidation.omit({ search: true }));

export const queryValidationWithFields = queryValidation.merge(
  z.object({
    fields: z
      .string()
      .optional()
      .transform((val) => val?.split(",")),
  }),
);

export const collectionDocumentHistoryQueryValidation = queryValidation.omit({
  search: true,
});
