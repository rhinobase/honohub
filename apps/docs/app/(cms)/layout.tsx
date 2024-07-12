"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

const CLIENT = new QueryClient();

export default function CMSLayout(props: PropsWithChildren) {
  return (
    <QueryClientProvider client={CLIENT}>
      <div className="flex w-full h-screen">{props.children}</div>
    </QueryClientProvider>
  );
}
