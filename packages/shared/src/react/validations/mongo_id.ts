import isMongoId from "validator/es/lib/isMongoId";
import z from "zod";

export const mongoIDValidation = z.string().refine(isMongoId);
