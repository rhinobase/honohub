import { z } from "zod";

export const graphQLBodyValidation = z.object({
  operationName: z.string().optional(),
  query: z.string(),
  variables: z.record(z.string(), z.any()),
});
