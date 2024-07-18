import { z } from "zod";

export const actionValidationSchema = z.object({
  ids: z.array(z.string()).min(1).max(100),
});
