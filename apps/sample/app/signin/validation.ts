import z from "zod";

export const redirectURLValidation = z
  .string()
  .refine((value) => /^\/[a-zA-Z0-9-_\/]*$/.test(value), {
    message: "Invalid redirect path",
  })
  .default("/");
