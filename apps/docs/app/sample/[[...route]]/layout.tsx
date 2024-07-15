"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

const CLIENT = new QueryClient();

export default function Layout({ children }: PropsWithChildren) {
  return <QueryClientProvider client={CLIENT}>{children}</QueryClientProvider>;
}
