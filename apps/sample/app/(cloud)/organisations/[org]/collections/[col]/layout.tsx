import { HasCollectionPermission } from "@honohub/shared";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Manage Collection",
};

export default function CollectionLayout({ children }: PropsWithChildren) {
  return (
    <HasCollectionPermission showError>{children}</HasCollectionPermission>
  );
}
