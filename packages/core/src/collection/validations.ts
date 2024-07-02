import { z } from "zod";

export const paramsSchema = z.object({
  limit: z.coerce.number().nonnegative().optional(),
  offset: z.coerce.number().nonnegative().optional(),
});
