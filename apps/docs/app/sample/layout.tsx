"use client";
import { ArrowUpTrayIcon, CircleStackIcon } from "@heroicons/react/24/outline";
import { AppWrapper } from "@honohub/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { Sidebar } from "./Sidebar";

const CLIENT = new QueryClient();

export default function SampleLayout({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={CLIENT}>
      <div className="flex w-full h-screen">
        <AppWrapper
          items={[
            {
              label: "sample",
              icon: CircleStackIcon,
              route: "/sample/list",
            },
            {
              label: "file upload",
              icon: ArrowUpTrayIcon,
              route: "/sample/upload",
            },
          ]}
        >
          <Sidebar
            options={[
              { label: "Sample", icon: "chart-bar-square", slug: "sample" },
            ]}
          />
          <div className="flex-1 px-12 py-4 overflow-x-hidden overflow-y-auto scroll-smooth">
            <div className="flex flex-col min-h-0 w-full h-full flex-grow gap-[30px]">
              {children}
            </div>
          </div>
        </AppWrapper>
      </div>
    </QueryClientProvider>
  );
}
