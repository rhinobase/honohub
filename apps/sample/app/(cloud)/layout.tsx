import type { Metadata } from "next/types";
import type { PropsWithChildren } from "react";
import { Providers } from "./Providers";

export const metadata: Metadata = {
  title: "Organisations",
  description: "All your organisations in one place.",
};

export default function CloudLayout(props: PropsWithChildren) {
  return (
    <Providers>
      <main className="h-full w-full flex">{props.children}</main>
    </Providers>
  );
}
