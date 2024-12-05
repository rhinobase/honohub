import z from "zod";
import { mongoIDValidation } from "./mongo_id";
import { queryValidation } from "./query";

export const userValidation = z.object({
  email: z.string().email().max(100),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password can not exceed 20 characters"),
  confirm: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password can not exceed 20 characters"),
  first_name: z.string().min(3).max(30).trim(),
  last_name: z.string().min(3).max(30).trim(),
  disabled: z.boolean().default(false),
  staff: z.boolean().default(false),
  superuser: z.boolean().default(false),
  role: mongoIDValidation.optional().nullable(),
  permissions: z
    .array(
      z.object({
        collection: z.string(),
        list: z.boolean().default(false),
        view: z.boolean().default(false),
        create: z.boolean().default(false),
        update: z.boolean().default(false),
        delete: z.boolean().default(false),
      }),
    )
    .default([]),
});

export const userPasswordValidation = userValidation
  .pick({ password: true, confirm: true })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

const booleanStringValidation = z
  .string()
  .refine((val) => {
    const value = val.toLowerCase();
    return value === "true" || value === "false";
  }, "Invalid boolean value")
  .transform((val) => val.toLowerCase());

export const userQueryValidation = queryValidation.merge(
  z.object({
    superuser: booleanStringValidation.optional(),
    staff: booleanStringValidation.optional(),
    disabled: booleanStringValidation.optional(),
    role: z
      .string()
      .optional()
      .transform((val) => val?.split(",")),
  }),
);
