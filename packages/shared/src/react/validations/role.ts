import { userValidation } from "./user";
import z from "zod";

export const roleValidation = z
  .object({
    name: z.string().min(4).max(100),
    description: z.string().max(2000).optional(),
  })
  .merge(userValidation.pick({ permissions: true }));
