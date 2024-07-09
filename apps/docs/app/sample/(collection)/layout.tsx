"use client";
import { Header } from "@honohub/react";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const slug = pathname.split("/")[2];

  return (
    <div className="flex flex-col min-h-0 w-full h-full flex-grow gap-[30px]">
      <Header slug={slug} basepath="/sample" />
      {children}
    </div>
  );
}
