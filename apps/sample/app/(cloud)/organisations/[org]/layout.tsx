import { OrganizationWrapper } from "@honohub/shared";
import type { Metadata } from "next/types";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your organization's dashboard.",
};

export default function OrganizationLayout(props: PropsWithChildren) {
  return <OrganizationWrapper>{props.children}</OrganizationWrapper>;
}
