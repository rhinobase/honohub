import z from "zod";

export enum CollectionIndexFieldType {
  ASC = "1",
  DESC = "-1",
  SPHERE = "2d",
  TEXT = "text",
}

export const collectionIndexValidation = z.object({
  fields: z.array(
    z.object({
      name: z.string({ message: "Field name is required" }),
      type: z.nativeEnum(CollectionIndexFieldType),
    }),
  ),
  options: z
    .object({
      unique: z.boolean().optional(),
      name: z
        .string()
        .optional()
        .refine((val) => val !== "", "Index name cannot be empty"),
      maxTimeMS: z
        .number({ message: "Maximum time cannot be empty" })
        .max(2147483647, "Maximum time cannot exceed 2147483647 seconds")
        .optional(),
    })
    .optional(),
});
