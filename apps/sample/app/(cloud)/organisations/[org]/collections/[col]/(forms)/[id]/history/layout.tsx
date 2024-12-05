import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

// TODO: Add collection name
export const metadata: Metadata = {
  title: "History | Manage Collection",
};

export default function CollectionHistoryLayout(props: PropsWithChildren) {
  return <>{props.children}</>;
}
