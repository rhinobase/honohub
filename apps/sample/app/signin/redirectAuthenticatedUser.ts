import { COOKIE_TOKEN_KEY, endpoint } from "@honohub/shared";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type z from "zod";
import type { redirectURLValidation } from "./validation";

export async function redirectAuthenticatedUser(
  redirectURL: z.infer<typeof redirectURLValidation>,
) {
  const cookieStore = cookies();
  const cookieToken = cookieStore.get(COOKIE_TOKEN_KEY);
  const token = cookieToken?.value;

  if (!token || token.length === 0) return;

  try {
    // Verifing the token
    await endpoint.get("/user/verify", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  } catch {
    return;
  }

  redirect(redirectURL);
}
