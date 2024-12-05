import { isMongoId } from "validator";
import z from "zod";

export const organizationValidation = z.object({
  name: z
    .string()
    .min(3, "Organization name is too short")
    .max(100, "Organization name is too long"),
  slug: z.string().max(100).optional(),
  report: z.boolean().default(false),
  template: z
    .object({
      organisation: z
        .string()
        .optional()
        .refine((val) => (val ? isMongoId(val) : undefined))
        .optional(),
      role: z.boolean().default(false),
    })
    .transform((val) => (val.organisation ? val : undefined))
    .optional(),
});
