"use client";
import { LoadingComponent, useOrganization } from "@honohub/shared";
import { useRouter } from "next/navigation";

export default function OrganizationRedirectPage() {
  const router = useRouter();
  const { defaultOrganisation, isLoading } = useOrganization();

  if (isLoading)
    return <LoadingComponent>Getting organization...</LoadingComponent>;

  if (defaultOrganisation)
    router.push(`/organisations/${defaultOrganisation.slug}`);
  else router.push("/");

  return <></>;
}
