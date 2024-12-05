import z from "zod";
import { DocumentSubmitType, SUBMIT_BUTTON_KEY } from "../../shared";

export const submitButtonValidation = z.object({
  [SUBMIT_BUTTON_KEY]: z.nativeEnum(DocumentSubmitType),
});
