import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

// TODO: Add collection name
export const metadata: Metadata = {
  title: "Create Document | Manage Collection",
};

export default function CreateCollectionLayout(props: PropsWithChildren) {
  return <>{props.children}</>;
}
