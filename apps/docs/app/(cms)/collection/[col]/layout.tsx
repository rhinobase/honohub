"use client";
import { CollectionSidebar } from "@honohub/react";
import type { PropsWithChildren } from "react";

const COLLECTIONS = [{ label: "Sample", slug: "sample" }];

export default function CollectionLayout(props: PropsWithChildren) {
  return (
    <>
      <CollectionSidebar options={COLLECTIONS} />
      <div className="flex-1 px-10 py-4 overflow-x-hidden overflow-y-auto scroll-smooth">
        <div className="flex flex-col min-h-0 w-full h-full flex-grow gap-5">
          {props.children}
        </div>
      </div>
    </>
  );
}
