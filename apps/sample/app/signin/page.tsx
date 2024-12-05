import { SigninPage as PageRender } from "@honohub/shared";
import { redirectAuthenticatedUser } from "./redirectAuthenticatedUser";
import { redirectURLValidation } from "./validation";
import { Suspense } from "react";

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
