import { userValidation } from "./user";

export const authValidation = userValidation.pick({
  email: true,
  password: true,
});
