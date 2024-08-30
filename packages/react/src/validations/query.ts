import z from "zod";

export const queryValidation = z.object({
  limit: z.coerce.number().nonnegative().default(10),
  offset: z.coerce.number().nonnegative().default(0),
  search: z.coerce.string().optional(),
});
