import { z } from "zod";

export const queryValidationSchema = z.object({
  limit: z.coerce.number().min(0).max(100).optional(),
  offset: z.coerce.number().nonnegative().optional().default(0),
  search: z.string().optional(),
  sortBy: z.string().optional(),
});
