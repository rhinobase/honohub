import z from "zod";

export const collectionActionValidation = z.object({
  name: z.string().min(1).max(150),
  icon: z.string().min(1).max(50),
  label: z.string().max(150).optional(),
  level: z
    .union([
      z.object({
        title: z.string().min(1).max(150),
        message: z.string().min(1).max(150),
      }),
      z.boolean(),
    ])
    .default(false),
  endpoint: z.string().min(1).max(255).url(),
});
