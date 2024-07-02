import { z } from "zod";

export const queryValidationSchema = z.object({
  limit: z.number().min(0).max(100).optional().default(10),
  offset: z.number().nonnegative().optional().default(0),
  search: z.string().optional(),
  sortBy: z.string().optional(),
});
