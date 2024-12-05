import { SigninPage as PageRender } from "@honohub/shared";
import { Suspense } from "react";
import { redirectAuthenticatedUser } from "./redirectAuthenticatedUser";
import { redirectURLValidation } from "./validation";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { redirect: string };
}) {
  const redirectURL = redirectURLValidation.parse(searchParams.redirect);
  await redirectAuthenticatedUser(redirectURL);

  return (
    <Suspense>
      <PageRender redirectUrl={redirectURL} />
    </Suspense>
  );
}
