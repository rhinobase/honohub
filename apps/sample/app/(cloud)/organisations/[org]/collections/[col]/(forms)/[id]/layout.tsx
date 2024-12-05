import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

// TODO: Add collection name
export const metadata: Metadata = {
  title: "Update Document | Manage Collection",
};

export default function UpdateCollectionLayout(props: PropsWithChildren) {
  return <>{props.children}</>;
}
