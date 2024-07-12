"use client";
import { AcademicCapIcon, BugAntIcon } from "@heroicons/react/24/outline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { Sidebar } from "../Sidebar";

const CLIENT = new QueryClient();

const OPTIONS = {
  plugin: [{ label: "Collection", slug: "sample", icon: AcademicCapIcon }],
  general: [{ label: "Settings", slug: "settngs", icon: BugAntIcon }],
};

export default function Layout({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={CLIENT}>
      <div className="flex w-full h-screen">
        <Sidebar options={OPTIONS} />
        {children}
      </div>
    </QueryClientProvider>
  );
}
